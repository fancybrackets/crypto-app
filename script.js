// Global variables
let rsaKeyPair = null;

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: '#fff',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '300px',
        animation: 'slideIn 0.3s ease-out'
    });
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(45deg, #00ff88, #00ccff)';
            notification.style.color = '#000';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(45deg, #ff4444, #ff8888)';
            break;
        default:
            notification.style.background = 'linear-gradient(45deg, #333, #555)';
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.crypto-section');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and sections
            navTabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding section
            this.classList.add('active');
            document.getElementById(targetTab + '-section').classList.add('active');
        });
    });
    
    // File input handler for SHA256
    const fileInput = document.getElementById('sha256-file');
    const fileInfo = document.getElementById('file-info');
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileInfo.textContent = `Seçilen dosya: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        } else {
            fileInfo.textContent = '';
        }
    });
});

// Password generation
function generatePassword(inputId) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById(inputId).value = password;
    showNotification('Güçlü şifre oluşturuldu!', 'success');
}

// Copy to clipboard
async function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value;
    
    if (!text) {
        showNotification('Kopyalanacak içerik bulunamadı!', 'error');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Panoya kopyalandı!', 'success');
    } catch (err) {
        // Fallback for older browsers
        element.select();
        document.execCommand('copy');
        showNotification('Panoya kopyalandı!', 'success');
    }
}

// AES Encryption Functions
async function deriveKeyFromPassword(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    
    return await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

async function encryptAES() {
    const plaintext = document.getElementById('aes-plaintext').value;
    const password = document.getElementById('aes-password').value;
    const resultElement = document.getElementById('aes-result');
    
    if (!plaintext || !password) {
        showNotification('Lütfen metin ve şifre alanlarını doldurun!', 'error');
        return;
    }
    
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(plaintext);
        
        // Generate random salt and IV
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        // Derive key from password
        const key = await deriveKeyFromPassword(password, salt);
        
        // Encrypt data
        const encryptedData = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            data
        );
        
        // Combine salt, IV, and encrypted data
        const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encryptedData), salt.length + iv.length);
        
        // Convert to base64
        const base64Result = btoa(String.fromCharCode(...combined));
        resultElement.value = base64Result;
        
        showNotification('Metin başarıyla şifrelendi!', 'success');
    } catch (error) {
        console.error('Şifreleme hatası:', error);
        showNotification('Şifreleme sırasında hata oluştu!', 'error');
    }
}

async function decryptAES() {
    const encryptedText = document.getElementById('aes-plaintext').value;
    const password = document.getElementById('aes-password').value;
    const resultElement = document.getElementById('aes-result');
    
    if (!encryptedText || !password) {
        showNotification('Lütfen şifreli metin ve şifre alanlarını doldurun!', 'error');
        return;
    }
    
    try {
        // Convert from base64
        const combined = new Uint8Array(atob(encryptedText).split('').map(char => char.charCodeAt(0)));
        
        // Extract salt, IV, and encrypted data
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const encryptedData = combined.slice(28);
        
        // Derive key from password
        const key = await deriveKeyFromPassword(password, salt);
        
        // Decrypt data
        const decryptedData = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encryptedData
        );
        
        // Convert to text
        const decoder = new TextDecoder();
        const plaintext = decoder.decode(decryptedData);
        resultElement.value = plaintext;
        
        showNotification('Metin başarıyla şifre çözüldü!', 'success');
    } catch (error) {
        console.error('Şifre çözme hatası:', error);
        showNotification('Şifre çözme sırasında hata oluştu! Şifre yanlış olabilir.', 'error');
    }
}

function clearAES() {
    document.getElementById('aes-plaintext').value = '';
    document.getElementById('aes-password').value = '';
    document.getElementById('aes-result').value = '';
    showNotification('AES alanları temizlendi!', 'success');
}

// RSA Encryption Functions
async function generateRSAKeys() {
    const keySize = parseInt(document.getElementById('rsa-key-size').value);
    const publicKeyElement = document.getElementById('rsa-public-key');
    const privateKeyElement = document.getElementById('rsa-private-key');
    
    try {
        showNotification('Anahtar çifti oluşturuluyor...', 'info');
        
        rsaKeyPair = await crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: keySize,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: 'SHA-256'
            },
            true,
            ['encrypt', 'decrypt']
        );
        
        // Export keys
        const publicKey = await crypto.subtle.exportKey('spki', rsaKeyPair.publicKey);
        const privateKey = await crypto.subtle.exportKey('pkcs8', rsaKeyPair.privateKey);
        
        // Convert to PEM format
        const publicKeyPem = arrayBufferToPem(publicKey, 'PUBLIC KEY');
        const privateKeyPem = arrayBufferToPem(privateKey, 'PRIVATE KEY');
        
        publicKeyElement.value = publicKeyPem;
        privateKeyElement.value = privateKeyPem;
        
        showNotification('Anahtar çifti başarıyla oluşturuldu!', 'success');
    } catch (error) {
        console.error('Anahtar oluşturma hatası:', error);
        showNotification('Anahtar oluşturma sırasında hata oluştu!', 'error');
    }
}

function arrayBufferToPem(buffer, type) {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const formatted = base64.match(/.{1,64}/g).join('\n');
    return `-----BEGIN ${type}-----\n${formatted}\n-----END ${type}-----`;
}

async function encryptRSA() {
    const plaintext = document.getElementById('rsa-plaintext').value;
    const resultElement = document.getElementById('rsa-result');
    
    if (!plaintext) {
        showNotification('Lütfen şifrelenecek metni girin!', 'error');
        return;
    }
    
    if (!rsaKeyPair) {
        showNotification('Önce anahtar çifti oluşturun!', 'error');
        return;
    }
    
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(plaintext);
        
        // RSA-OAEP has size limitations, check if text is too long
        const maxSize = Math.floor((parseInt(document.getElementById('rsa-key-size').value) / 8) - 42);
        if (data.length > maxSize) {
            showNotification(`Metin çok uzun! Maksimum ${maxSize} karakter olmalı.`, 'error');
            return;
        }
        
        const encryptedData = await crypto.subtle.encrypt(
            { name: 'RSA-OAEP' },
            rsaKeyPair.publicKey,
            data
        );
        
        const base64Result = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
        resultElement.value = base64Result;
        
        showNotification('Metin başarıyla şifrelendi!', 'success');
    } catch (error) {
        console.error('RSA şifreleme hatası:', error);
        showNotification('Şifreleme sırasında hata oluştu!', 'error');
    }
}

async function decryptRSA() {
    const encryptedText = document.getElementById('rsa-plaintext').value;
    const resultElement = document.getElementById('rsa-result');
    
    if (!encryptedText) {
        showNotification('Lütfen şifreli metni girin!', 'error');
        return;
    }
    
    if (!rsaKeyPair) {
        showNotification('Önce anahtar çifti oluşturun!', 'error');
        return;
    }
    
    try {
        const encryptedData = new Uint8Array(atob(encryptedText).split('').map(char => char.charCodeAt(0)));
        
        const decryptedData = await crypto.subtle.decrypt(
            { name: 'RSA-OAEP' },
            rsaKeyPair.privateKey,
            encryptedData
        );
        
        const decoder = new TextDecoder();
        const plaintext = decoder.decode(decryptedData);
        resultElement.value = plaintext;
        
        showNotification('Metin başarıyla şifre çözüldü!', 'success');
    } catch (error) {
        console.error('RSA şifre çözme hatası:', error);
        showNotification('Şifre çözme sırasında hata oluştu!', 'error');
    }
}

function clearRSA() {
    document.getElementById('rsa-plaintext').value = '';
    document.getElementById('rsa-result').value = '';
    document.getElementById('rsa-public-key').value = '';
    document.getElementById('rsa-private-key').value = '';
    rsaKeyPair = null;
    showNotification('RSA alanları temizlendi!', 'success');
}



// SHA256 Hash Functions
async function calculateSHA256() {
    const textInput = document.getElementById('sha256-input').value;
    const fileInput = document.getElementById('sha256-file');
    const resultElement = document.getElementById('sha256-result');
    
    let data;
    let source = '';
    
    // Check if file is selected
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        source = `dosya: ${file.name}`;
        
        try {
            data = await file.arrayBuffer();
        } catch (error) {
            showNotification('Dosya okuma hatası!', 'error');
            return;
        }
    } else if (textInput.trim()) {
        // Use text input
        source = 'metin';
        const encoder = new TextEncoder();
        data = encoder.encode(textInput);
    } else {
        showNotification('Lütfen metin girin veya dosya seçin!', 'error');
        return;
    }
    
    try {
        showNotification(`SHA256 hesaplanıyor (${source})...`, 'info');
        
        // Calculate SHA-256 hash
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        
        // Convert to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        resultElement.value = hashHex.toLowerCase();
        
        showNotification(`SHA256 hash başarıyla hesaplandı (${source})!`, 'success');
    } catch (error) {
        console.error('SHA256 hesaplama hatası:', error);
        showNotification('Hash hesaplama sırasında hata oluştu!', 'error');
    }
}

function clearSHA256() {
    document.getElementById('sha256-input').value = '';
    document.getElementById('sha256-file').value = '';
    document.getElementById('sha256-result').value = '';
    document.getElementById('file-info').textContent = '';
    showNotification('SHA256 alanları temizlendi!', 'success');
}

// Additional utility functions for enhanced functionality
function downloadResult(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add download functionality to results
function addDownloadButtons() {
    const resultElements = document.querySelectorAll('.text-output');
    
    resultElements.forEach((element, index) => {
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'copy-btn';
        downloadBtn.style.right = '50px';
        downloadBtn.innerHTML = '💾 İndir';
        downloadBtn.onclick = function() {
            const content = element.value;
            if (!content) {
                showNotification('İndirilecek içerik bulunamadı!', 'error');
                return;
            }
            
            let filename = 'result.txt';
            if (element.id.includes('aes')) {
                filename = 'aes_result.txt';
            } else if (element.id.includes('rsa')) {
                filename = 'rsa_result.txt';
            } else if (element.id.includes('sha256')) {
                filename = 'sha256_hash.txt';
            }
            
            downloadResult(content, filename);
            showNotification('Dosya indirildi!', 'success');
        };
        
        element.parentNode.appendChild(downloadBtn);
    });
}

// Initialize download buttons when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure all elements are rendered
    setTimeout(addDownloadButtons, 100);
});

// Enhanced error handling and validation
function validateInput(text, maxLength = null) {
    if (!text || text.trim() === '') {
        return { valid: false, message: 'Giriş alanı boş olamaz!' };
    }
    
    if (maxLength && text.length > maxLength) {
        return { valid: false, message: `Metin çok uzun! Maksimum ${maxLength} karakter olmalı.` };
    }
    
    return { valid: true };
}

function validatePassword(password) {
    if (!password || password.length < 8) {
        return { valid: false, message: 'Şifre en az 8 karakter olmalı!' };
    }
    
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!(hasUpper && hasLower && hasNumber && hasSpecial)) {
        return { 
            valid: false, 
            message: 'Şifre büyük harf, küçük harf, rakam ve özel karakter içermelidir!' 
        };
    }
    
    return { valid: true };
}

// Performance monitoring
function measurePerformance(operation, func) {
    return async function(...args) {
        const startTime = performance.now();
        const result = await func.apply(this, args);
        const endTime = performance.now();
        
        console.log(`${operation} işlemi ${(endTime - startTime).toFixed(2)} ms sürdü`);
        return result;
    };
}

// Wrap performance-critical functions
const originalEncryptAES = encryptAES;
const originalDecryptAES = decryptAES;
const originalEncryptRSA = encryptRSA;
const originalDecryptRSA = decryptRSA;
const originalCalculateSHA256 = calculateSHA256;

encryptAES = measurePerformance('AES Şifreleme', originalEncryptAES);
decryptAES = measurePerformance('AES Şifre Çözme', originalDecryptAES);
encryptRSA = measurePerformance('RSA Şifreleme', originalEncryptRSA);
decryptRSA = measurePerformance('RSA Şifre Çözme', originalDecryptRSA);
calculateSHA256 = measurePerformance('SHA256 Hash', originalCalculateSHA256);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter to encrypt/hash in active section
    if (e.ctrlKey && e.key === 'Enter') {
        const activeSection = document.querySelector('.crypto-section.active');
        if (activeSection) {
            const encryptBtn = activeSection.querySelector('.encrypt-btn, .hash-btn');
            if (encryptBtn) {
                encryptBtn.click();
            }
        }
        e.preventDefault();
    }
    
    // Ctrl+Shift+C to clear active section
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        const activeSection = document.querySelector('.crypto-section.active');
        if (activeSection) {
            const clearBtn = activeSection.querySelector('.clear-btn');
            if (clearBtn) {
                clearBtn.click();
            }
        }
        e.preventDefault();
    }
});

// Add tooltips for keyboard shortcuts
function addTooltips() {
    const encryptBtns = document.querySelectorAll('.encrypt-btn, .hash-btn');
    const clearBtns = document.querySelectorAll('.clear-btn');
    
    encryptBtns.forEach(btn => {
        btn.title = 'Kısayol: Ctrl+Enter';
    });
    
    clearBtns.forEach(btn => {
        btn.title = 'Kısayol: Ctrl+Shift+C';
    });
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addTooltips, 200);
});

// Auto-save functionality (optional)
function setupAutoSave() {
    const inputs = document.querySelectorAll('.text-input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const key = `cryptoguard_${this.id}`;
            localStorage.setItem(key, this.value);
        });
        
        // Load saved content
        const key = `cryptoguard_${input.id}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            input.value = saved;
        }
    });
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupAutoSave, 300);
});

// Add clear all saved data function
function clearAllSavedData() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cryptoguard_'));
    keys.forEach(key => localStorage.removeItem(key));
    showNotification('Kaydedilen tüm veriler temizlendi!', 'success');
}

console.log('CryptoGuard v1.0 - Güvenli Şifreleme Sistemi yüklendi!');
console.log('Kısayollar:');
console.log('- Ctrl+Enter: Şifrele/Hash hesapla');
console.log('- Ctrl+Shift+C: Temizle');

