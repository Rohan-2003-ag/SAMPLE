// Photo Gallery with Upload - Images in Grid Boxes
// Images display in their grid boxes, lightbox is a contained panel

// ===== INITIAL STATE =====
let galleryImages = [];
let currentTheme = 'light';

// ===== DOM ELEMENTS (populated on init) =====
let grid = null;
let emptyState = null;
let categoryBtns = null;
let themeToggle = null;
let moonIcon = null;
let sunIcon = null;
let photoUploadInput = null;
let fileInput = null;
let dropZone = null;
let previewArea = null;
let uploadBtn = null;
let cancelBtn = null;
let lightbox = null;
let lightboxImage = null;
let lightboxCaption = null;
let lightboxClose = null;
let prevBtn = null;
let nextBtn = null;

// ===== SAMPLE IMAGE DATA =====
const initialImages = [
  {
    id: 1,
    title: "Mountain Sunrise",
    category: "nature",
    url: "https://images.unsplash.com/photo-1507525428034-b7238261c025?w=500&h=400&fit=crop",
    description: "Beautiful mountain landscape at sunrise"
  },
  {
    id: 2,
    title: "City Sunset",
    category: "city",
    url: "https://images.unsplash.com/photo-1477959611340-be6f4666e3c9?w=500&h=400&fit=crop",
    description: "Urban skyline at sunset"
  },
  {
    id: 3,
    title: "Forest Path",
    category: "nature",
    url: "https://images.unsplash.com/photo-14464266305533963024386d1bf7d23f.jpg?w=500&h=400&fit=crop",
    description: "Peaceful forest walking path"
  },
  {
    id: 4,
    title: "Ocean Waves",
    category: "nature",
    url: "https://images.unsplash.com/photo-1516191326043-bf86c36b8d18?w=500&h=400&fit=crop",
    description: "Crashing ocean waves at beach"
  },
  {
    id: 5,
    title: "Street Lamp",
    category: "city",
    url: "https://images.unsplash.com/photo-1518837214108-b660c6f7b6c5?w=500&h=400&fit=crop",
    description: "City street at night"
  },
  {
    id: 6,
    title: "Autumn Leaves",
    category: "nature",
    url: "https://images.unsplash.com/photo-1493858288088-4e36c1ea3ee5?w=500&h=400&fit=crop",
    description: "Fall leaves on the ground"
  },
  {
    id: 7,
    title: "Building Silhouette",
    category: "city",
    url: "https://images.unsplash.com/photo-1486406651114-a4a66d8f5143?w=500&h=400&fit=crop",
    description: "Modern architecture silhouette"
  },
  {
    id: 8,
    title: "Mist Mountain",
    category: "nature",
    url: "https://images.unsplash.com/photo-1461749291134-3c05c8c0fd0e?w=500&h=400&fit=crop",
    description: "Misty mountain peak"
  }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize elements
  grid = document.getElementById('grid');
  emptyState = document.getElementById('emptyState');
  categoryBtns = document.querySelectorAll('.category-btn');
  themeToggle = document.getElementById('themeToggle');
  moonIcon = document.getElementById('moonIcon');
  sunIcon = document.getElementById('sunIcon');
  photoUploadInput = document.getElementById('photoUpload');
  fileInput = document.getElementById('fileInput');
  dropZone = document.getElementById('dropZone');
  previewArea = document.getElementById('previewArea');
  uploadBtn = document.querySelector('.btn-save');
  cancelBtn = document.querySelector('.btn-cancel');
  lightbox = document.getElementById('lightbox');
  lightboxImage = document.getElementById('lightboxImage');
  lightboxCaption = document.getElementById('lightboxCaption');
  lightboxClose = document.querySelector('.lightbox-close');
  prevBtn = document.querySelector('.prev');
  nextBtn = document.querySelector('.next');

  // Load images from localStorage or use initial data
  const storedImages = localStorage.getItem('galleryImages');
  if (storedImages) {
    galleryImages = JSON.parse(storedImages);
  } else {
    galleryImages = [...initialImages];
    localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
  }

  // Apply saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    currentTheme = 'dark';
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    if (moonIcon) moonIcon.style.display = 'none';
    if (sunIcon) sunIcon.style.display = 'block';
  } else {
    currentTheme = 'light';
    document.body.classList.add('light');
    document.body.classList.remove('dark');
    if (moonIcon) moonIcon.style.display = 'block';
    if (sunIcon) sunIcon.style.display = 'none';
  }

  // Render initial gallery
  renderGallery();

  // ===== EVENT LISTENERS =====

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';

      if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'block';
      } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
        if (moonIcon) moonIcon.style.display = 'block';
        if (sunIcon) sunIcon.style.display = 'none';
      }
      localStorage.setItem('theme', currentTheme);
    });
  }

  // Category filtering
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const category = this.getAttribute('data-category');
      const filteredImages = category === 'all'
        ? galleryImages
        : galleryImages.filter(img => img.category === category);
      renderGallery(filteredImages);
    });
  });

  // Upload/Browse button in bar
  const uploadBtnInBar = document.querySelector('.upload-btn');
  if (uploadBtnInBar) {
    uploadBtnInBar.addEventListener('click', function() {
      if (fileInput) fileInput.click();
    });
  }

  // File input change
  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
  }

  // Drop zone drag events
  if (dropZone) {
    dropZone.addEventListener('dragover', function(e) {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', function() {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0 && fileInput) {
        fileInput.files = files;
        handleFileSelect({ target: fileInput });
      }
    });
  }

  // Lightbox close button
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightboxHandler);
  }

  // Navigation buttons
  if (prevBtn) prevBtn.addEventListener('click', function() { changeImageLightbox(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { changeImageLightbox(1); });

  // Escape key to close lightbox
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeLightboxHandler();
    }
  });

  // Click outside lightbox to close
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightboxHandler();
      }
    });
  }
}

// ===== CORE FUNCTIONS =====

// Theme toggle
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';

  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    if (moonIcon) moonIcon.style.display = 'none';
    if (sunIcon) sunIcon.style.display = 'block';
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
    if (moonIcon) moonIcon.style.display = 'block';
    if (sunIcon) sunIcon.style.display = 'none';
  }
  localStorage.setItem('theme', currentTheme);
}

// Handle file selection
function handleFileSelect(event) {
  const file = event.target.files[0];

  if (!file) return;

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    alert('File is too large. Maximum size is 10MB.');
    return;
  }

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.');
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const previewHtml = `
      <div class="preview-image" id="previewImg">
        <img src="${e.target.result}" alt="Preview">
      </div>
      <button class="btn-cancel-preview" onclick="cancelUpload()">Cancel</button>
    `;
    previewArea.innerHTML = previewHtml;
    previewArea.classList.remove('empty');
  };

  reader.readAsDataURL(file);

  previewArea.style.display = 'block';
  if (uploadBtn) uploadBtn.style.display = 'inline-block';
  if (cancelBtn) cancelBtn.style.display = 'inline-block';
}

// Cancel upload
function cancelUpload() {
  const previewArea = document.getElementbyId('previewArea');
  if (previewArea) {
    previewArea.innerHTML = '';
    previewArea.classList.add('empty');
    previewArea.style.display = 'none';
  }
  if (uploadBtn) uploadBtn.style.display = 'none';
  if (cancelBtn) cancelBtn.style.display = 'none';
  const fileInput = document.getElementById('fileInput');
  if (fileInput) fileInput.value = '';
}

// Save image to gallery
function saveImage() {
  const previewImg = document.getElementById('previewImg');
  if (!previewImg) return;

  const imageUrl = previewImg.src;
  const title = prompt('Enter a title for this photo:') || 'Untitled';

  const newImage = {
    id: Date.now(),
    title: title,
    category: 'uploaded',
    url: imageUrl,
    description: 'Uploaded by user'
  };

  galleryImages.push(newImage);
  localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
  renderGallery();
  cancelUpload();

  alert('Photo added successfully!');
}

// ===== GALLERY FUNCTIONS =====

function renderGallery(imagesToRender = null) {
  if (!imagesToRender || imagesToRender.length === 0) {
    imagesToRender = galleryImages;
  }

  if (imagesToRender.length === 0) {
    if (grid) {
      grid.innerHTML = '';
      if (emptyState) {
        emptyState.style.display = 'block';
        emptyState.innerHTML = '<p>No images in this category</p>';
      }
    }
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  if (grid) {
    grid.innerHTML = imagesToRender.map(img => `
      <div class="gallery-item" onclick="openLightboxPanel('${img.url}', '${img.title}')">
        <img src="${img.url}" alt="${img.title}" loading="lazy" 
             style="width: 100%; height: 100%; object-fit: cover;">
        <div class="overlay">
          <h3>${img.title}</h3>
          <p>${img.description}</p>
        </div>
      </div>
    `).join('');
  }
}

// Lightbox functions - now a contained panel
function openLightboxPanel(url, title) {
  if (!lightboxImage || !lightboxCaption) return;

  lightbox.style.display = 'flex';
  lightboxImage.src = url;
  lightboxCaption.textContent = title;

  // Lightbox is now a contained panel - click to close
  // No navigation arrows by default
}

function closeLightboxHandler() {
  if (lightbox) lightbox.style.display = 'none';
}

// Close lightbox - called from HTML onclick attribute
function closeLightbox() {
  if (lightbox) lightbox.style.display = 'none';
}

function changeImageLightbox(direction) {
  // Lightbox is a single image panel, no navigation
  // Can be extended later if needed
  if (lightboxImage && direction === -1) {
    // Close instead
    closeLightboxHandler();
  }
}