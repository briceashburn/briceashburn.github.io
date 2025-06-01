document.getElementById('helloBtn').addEventListener('click', function() {
  this.textContent = '🎉 Clicked! 🎉';
  this.style.background = 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)';
  this.style.color = '#222';
  setTimeout(() => {
    this.textContent = 'Click Me';
    this.style.background = '';
    this.style.color = '';
  }, 1500);
});