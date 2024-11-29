// Bloqueia o botão direito do mouse
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    alert('Ação desabilitada!');
});

// Bloqueia o uso de teclas específicas como F12, Ctrl+Shift+I, Ctrl+U
document.addEventListener('keydown', function (e) {
    // F12
    if (e.keyCode === 123) {
        e.preventDefault();
        alert('Ação desabilitada!');
    }

    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U e Ctrl+S
    if ((e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
        (e.ctrlKey && e.keyCode === 83)) { // Ctrl+S
        e.preventDefault();
        alert('Ação desabilitada!');
    }
});
