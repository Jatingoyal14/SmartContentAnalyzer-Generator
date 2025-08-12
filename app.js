// Application data from JSON
const appData = {
  objectDetectionModels: [
    {"name": "YOLOv8", "accuracy": "92.3%", "speed": "45 FPS"},
    {"name": "Faster R-CNN", "accuracy": "89.7%", "speed": "12 FPS"},
    {"name": "SSD MobileNet", "accuracy": "85.1%", "speed": "60 FPS"}
  ],
  commonObjects: [
    "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", 
    "boat", "traffic light", "fire hydrant", "stop sign", "parking meter", "bench",
    "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra",
    "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
    "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove",
    "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup",
    "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange",
    "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch",
    "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse",
    "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink",
    "refrigerator", "book", "clock", "vase", "scissors", "teddy bear", "hair drier"
  ],
  sentimentKeywords: {
    positive: ["excellent", "amazing", "wonderful", "fantastic", "great", "good", "perfect", "awesome", "brilliant", "outstanding", "superb", "magnificent", "terrific", "fabulous", "marvelous"],
    negative: ["terrible", "awful", "horrible", "disgusting", "worst", "bad", "disappointing", "pathetic", "useless", "annoying", "frustrating", "depressing", "sad", "angry", "hate"],
    neutral: ["okay", "average", "normal", "standard", "typical", "usual", "common", "regular", "moderate", "fair"]
  },
  textTemplates: {
    story: [
      "Once upon a time, in a land far away, there lived a {character} who dreamed of {goal}. Every day, they would {action} until one day, something extraordinary happened...",
      "The year was {year}, and the world had changed dramatically. {character} walked through the {setting}, carrying nothing but {item} and a heart full of {emotion}...",
      "In the depths of {location}, a mysterious {object} began to glow with an otherworldly light. {character} approached carefully, knowing that their life was about to change forever..."
    ],
    educational: [
      "Understanding {topic}: {topic} is a fundamental concept in {field} that involves {process}. The key principles include {principles} and practical applications range from {applications}.",
      "Key Facts about {topic}: 1) {fact1}, 2) {fact2}, 3) {fact3}. These elements work together to create {outcome}.",
      "The importance of {topic} in modern society cannot be overstated. It affects {area1}, influences {area2}, and shapes {area3}."
    ]
  }
};

// Global variables
let currentTab = 'image-analysis';
let uploadedImage = null;
let charts = {};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing application...');
  initializeTabNavigation();
  initializeImageAnalysis();
  initializeTextIntelligence();
  initializeContentGenerator();
  initializeMultiModal();
  initializeProjectInfo();
  console.log('Application initialized successfully');
});

// Tab Navigation - Fixed
function initializeTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  console.log('Found', tabButtons.length, 'tab buttons');

  tabButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const tabId = this.getAttribute('data-tab');
      
      console.log('Tab clicked:', tabId);
      
      // Remove active states from all tabs and contents
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active state to clicked tab and corresponding content
      this.classList.add('active');
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add('active');
        currentTab = tabId;
        console.log('Switched to tab:', tabId);
      } else {
        console.error('Tab content not found:', tabId);
      }
    });
  });
}

// Image Analysis Functions - Fixed
function initializeImageAnalysis() {
  console.log('Initializing image analysis...');
  
  const uploadArea = document.getElementById('imageUpload');
  const fileInput = document.getElementById('imageInput');
  const confidenceSlider = document.getElementById('confidenceSlider');
  const confidenceValue = document.getElementById('confidenceValue');
  
  if (!uploadArea || !fileInput) {
    console.error('Image upload elements not found');
    return;
  }
  
  // File upload handling - Fixed click event
  uploadArea.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Upload area clicked');
    fileInput.click();
  });
  
  // Fixed drag and drop
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      processImageFile(files[0]);
    }
  });
  
  fileInput.addEventListener('change', function(e) {
    console.log('File input changed');
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  });
  
  // Confidence slider
  if (confidenceSlider && confidenceValue) {
    confidenceSlider.addEventListener('input', function(e) {
      confidenceValue.textContent = e.target.value;
      if (uploadedImage) {
        // Re-analyze with new confidence threshold
        setTimeout(() => analyzeImage(uploadedImage, parseFloat(e.target.value)), 100);
      }
    });
  }
  
  console.log('Image analysis initialized');
}

function processImageFile(file) {
  console.log('Processing image file:', file.name);
  
  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedImage = {
      src: e.target.result,
      name: file.name,
      size: file.size
    };
    displayUploadedImage(uploadedImage);
    analyzeImage(uploadedImage);
  };
  reader.readAsDataURL(file);
}

function displayUploadedImage(image) {
  const uploadArea = document.getElementById('imageUpload');
  const imageContainer = document.getElementById('uploadedImageContainer');
  const imageElement = document.getElementById('uploadedImage');
  
  if (uploadArea && imageContainer && imageElement) {
    uploadArea.style.display = 'none';
    imageContainer.style.display = 'block';
    imageElement.src = image.src;
    imageElement.alt = image.name;
  }
}

function analyzeImage(image, confidenceThreshold = 0.5) {
  const loading = document.getElementById('imageLoading');
  const results = document.getElementById('imageResults');
  
  if (loading) loading.style.display = 'block';
  if (results) results.style.display = 'none';
  
  // Simulate AI processing time
  setTimeout(() => {
    const detectedObjects = generateObjectDetections(confidenceThreshold);
    const sceneDescription = generateSceneDescription(detectedObjects);
    
    displayImageResults(detectedObjects, sceneDescription);
    createBoundingBoxes(detectedObjects);
    createConfidenceChart(detectedObjects);
    
    if (loading) loading.style.display = 'none';
    if (results) {
      results.style.display = 'block';
      results.classList.add('fade-in');
    }
  }, 2000 + Math.random() * 1000);
}

function generateObjectDetections(threshold) {
  const numObjects = Math.floor(Math.random() * 8) + 3;
  const detectedObjects = [];
  
  for (let i = 0; i < numObjects; i++) {
    const object = appData.commonObjects[Math.floor(Math.random() * appData.commonObjects.length)];
    const confidence = Math.random() * (1 - threshold) + threshold;
    
    if (confidence >= threshold) {
      detectedObjects.push({
        name: object,
        confidence: confidence,
        bbox: {
          x: Math.random() * 60 + 10,
          y: Math.random() * 60 + 10,
          width: Math.random() * 20 + 15,
          height: Math.random() * 20 + 15
        }
      });
    }
  }
  
  return detectedObjects.sort((a, b) => b.confidence - a.confidence);
}

function generateSceneDescription(objects) {
  const descriptions = [
    `This image contains ${objects.length} detected objects including ${objects.slice(0, 3).map(o => o.name).join(', ')}. The scene appears to be captured in a natural setting with good lighting conditions.`,
    `The AI model has identified several key elements in this image. The most prominent objects are ${objects[0]?.name} with ${(objects[0]?.confidence * 100).toFixed(1)}% confidence, suggesting a high-quality detection result.`,
    `Analysis reveals a complex scene with multiple objects of interest. The detection algorithm shows strong performance with confidence scores ranging from ${(Math.min(...objects.map(o => o.confidence)) * 100).toFixed(1)}% to ${(Math.max(...objects.map(o => o.confidence)) * 100).toFixed(1)}%.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function displayImageResults(objects, description) {
  const objectsContainer = document.getElementById('detectedObjects');
  const descriptionContainer = document.getElementById('sceneDescription');
  
  if (objectsContainer) {
    objectsContainer.innerHTML = objects.map(obj => `
      <div class="object-item slide-in">
        <span class="object-name">${obj.name}</span>
        <span class="confidence-score">${(obj.confidence * 100).toFixed(1)}%</span>
      </div>
    `).join('');
  }
  
  if (descriptionContainer) {
    descriptionContainer.innerHTML = `
      <h4>Scene Analysis</h4>
      <p>${description}</p>
    `;
  }
}

function createBoundingBoxes(objects) {
  const overlay = document.getElementById('boundingBoxes');
  if (!overlay) return;
  
  overlay.innerHTML = '';
  
  objects.forEach(obj => {
    const box = document.createElement('div');
    box.className = 'bounding-box';
    box.style.left = `${obj.bbox.x}%`;
    box.style.top = `${obj.bbox.y}%`;
    box.style.width = `${obj.bbox.width}%`;
    box.style.height = `${obj.bbox.height}%`;
    
    const label = document.createElement('div');
    label.className = 'bounding-box-label';
    label.textContent = `${obj.name} ${(obj.confidence * 100).toFixed(1)}%`;
    
    box.appendChild(label);
    overlay.appendChild(box);
  });
}

function createConfidenceChart(objects) {
  const canvas = document.getElementById('confidenceChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  if (charts.confidence) {
    charts.confidence.destroy();
  }
  
  charts.confidence = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: objects.slice(0, 6).map(obj => obj.name),
      datasets: [{
        label: 'Confidence Score',
        data: objects.slice(0, 6).map(obj => obj.confidence * 100),
        backgroundColor: '#1FB8CD',
        borderColor: '#218BCC',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

// Text Intelligence Functions - Fixed
function initializeTextIntelligence() {
  console.log('Initializing text intelligence...');
  
  const analyzeBtn = document.getElementById('analyzeText');
  const clearBtn = document.getElementById('clearText');
  const sampleBtn = document.getElementById('loadSample');
  const textInput = document.getElementById('textInput');
  
  if (analyzeBtn) analyzeBtn.addEventListener('click', () => analyzeText());
  if (clearBtn) clearBtn.addEventListener('click', () => clearTextAnalysis());
  if (sampleBtn) sampleBtn.addEventListener('click', () => loadSampleText());
  if (textInput) textInput.addEventListener('input', () => updateTextStats());
  
  console.log('Text intelligence initialized');
}

function loadSampleText() {
  const sampleTexts = [
    "I absolutely love this new technology! It's amazing how artificial intelligence has revolutionized the way we work and live. The capabilities are truly outstanding and the future looks incredibly bright. This innovation will definitely change the world for the better.",
    "This product is completely terrible and a waste of money. I'm extremely disappointed with the poor quality and awful customer service. It's frustrating how bad this experience has been. I would never recommend this to anyone.",
    "The weather today is quite normal for this time of year. It's neither particularly good nor bad, just average conditions that we typically see. Most people seem to have a regular day planned with standard activities."
  ];
  
  const textInput = document.getElementById('textInput');
  if (textInput) {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    textInput.value = randomText;
    updateTextStats();
  }
}

function updateTextStats() {
  const textInput = document.getElementById('textInput');
  const statsContainer = document.getElementById('textStats');
  
  if (!textInput || !statsContainer) return;
  
  const text = textInput.value;
  
  if (text.length > 0) {
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    const characters = text.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const readabilityScore = calculateReadabilityScore(text);
    
    statsContainer.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-number">${words}</span>
          <span class="stat-label">Words</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">${characters}</span>
          <span class="stat-label">Characters</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">${sentences}</span>
          <span class="stat-label">Sentences</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">${readabilityScore}</span>
          <span class="stat-label">Readability</span>
        </div>
      </div>
    `;
    statsContainer.style.display = 'block';
  } else {
    statsContainer.style.display = 'none';
  }
}

function calculateReadabilityScore(text) {
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  if (sentences === 0 || words === 0) return 0;
  
  // Simple readability score
  const avgWordsPerSentence = words / sentences;
  const score = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 2)));
  return Math.round(score);
}

function analyzeText() {
  const textInput = document.getElementById('textInput');
  if (!textInput) return;
  
  const text = textInput.value.trim();
  if (!text) {
    showMessage('Please enter some text to analyze', 'error');
    return;
  }
  
  const loading = document.getElementById('textLoading');
  const results = document.getElementById('textResults');
  
  if (loading) loading.style.display = 'block';
  if (results) results.style.display = 'none';
  
  setTimeout(() => {
    const sentiment = analyzeSentiment(text);
    const summary = generateTextSummary(text);
    const keywords = extractKeywords(text);
    const languageStats = generateLanguageStats(text);
    
    displayTextResults(sentiment, summary, keywords, languageStats);
    createSentimentChart(sentiment);
    
    if (loading) loading.style.display = 'none';
    if (results) {
      results.style.display = 'block';
      results.classList.add('fade-in');
    }
  }, 1500 + Math.random() * 1000);
}

function analyzeSentiment(text) {
  const words = text.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;
  let neutralScore = 0;
  
  words.forEach(word => {
    if (appData.sentimentKeywords.positive.some(pos => word.includes(pos))) {
      positiveScore += 1;
    } else if (appData.sentimentKeywords.negative.some(neg => word.includes(neg))) {
      negativeScore += 1;
    } else if (appData.sentimentKeywords.neutral.some(neu => word.includes(neu))) {
      neutralScore += 1;
    }
  });
  
  const total = positiveScore + negativeScore + neutralScore || 1;
  const sentiment = {
    positive: (positiveScore / total) * 100,
    negative: (negativeScore / total) * 100,
    neutral: (neutralScore / total) * 100
  };
  
  // Determine overall sentiment
  const maxScore = Math.max(sentiment.positive, sentiment.negative, sentiment.neutral);
  if (maxScore === sentiment.positive) {
    sentiment.overall = 'positive';
  } else if (maxScore === sentiment.negative) {
    sentiment.overall = 'negative';
  } else {
    sentiment.overall = 'neutral';
  }
  
  return sentiment;
}

function generateTextSummary(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length <= 2) return text;
  
  // Simple extractive summarization - take first and most important sentences
  const summary = sentences.slice(0, Math.min(2, Math.ceil(sentences.length / 3))).join('. ') + '.';
  return summary;
}

function extractKeywords(text) {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  const commonWords = ['this', 'that', 'with', 'have', 'will', 'been', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'];
  
  const filteredWords = words.filter(word => !commonWords.includes(word));
  
  const wordFreq = {};
  filteredWords.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([word]) => word);
}

function generateLanguageStats(text) {
  return {
    language: 'English',
    confidence: '94.2%',
    wordComplexity: 'Medium',
    formalityLevel: 'Informal'
  };
}

function displayTextResults(sentiment, summary, keywords, languageStats) {
  // Display sentiment
  const sentimentDisplay = document.getElementById('sentimentDisplay');
  if (sentimentDisplay) {
    sentimentDisplay.innerHTML = `
      <div class="sentiment-indicator sentiment-${sentiment.overall}">
        <span>${sentiment.overall.toUpperCase()}</span>
        <strong>${sentiment[sentiment.overall].toFixed(1)}%</strong>
      </div>
    `;
  }
  
  // Display summary
  const summaryContainer = document.getElementById('textSummary');
  if (summaryContainer) {
    summaryContainer.innerHTML = summary;
  }
  
  // Display keywords
  const keywordsContainer = document.getElementById('keywords');
  if (keywordsContainer) {
    keywordsContainer.innerHTML = keywords.map(keyword => 
      `<span class="keyword-tag">${keyword}</span>`
    ).join('');
  }
  
  // Display language stats
  const languageContainer = document.getElementById('languageStats');
  if (languageContainer) {
    languageContainer.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-number">${languageStats.language}</span>
          <span class="stat-label">Language</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">${languageStats.confidence}</span>
          <span class="stat-label">Confidence</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">${languageStats.wordComplexity}</span>
          <span class="stat-label">Complexity</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">${languageStats.formalityLevel}</span>
          <span class="stat-label">Formality</span>
        </div>
      </div>
    `;
  }
}

function createSentimentChart(sentiment) {
  const canvas = document.getElementById('sentimentChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  if (charts.sentiment) {
    charts.sentiment.destroy();
  }
  
  charts.sentiment = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [{
        data: [sentiment.positive, sentiment.negative, sentiment.neutral],
        backgroundColor: ['#1FB8CD', '#FF5459', '#626C71'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function clearTextAnalysis() {
  const textInput = document.getElementById('textInput');
  const textStats = document.getElementById('textStats');
  const textResults = document.getElementById('textResults');
  
  if (textInput) textInput.value = '';
  if (textStats) textStats.style.display = 'none';
  if (textResults) textResults.style.display = 'none';
}

// Content Generator Functions - Fixed
function initializeContentGenerator() {
  console.log('Initializing content generator...');
  
  const generateBtn = document.getElementById('generateContent');
  const regenerateBtn = document.getElementById('regenerateContent');
  const copyBtn = document.getElementById('copyContent');
  const downloadBtn = document.getElementById('downloadContent');
  const creativitySlider = document.getElementById('creativitySlider');
  const creativityValue = document.getElementById('creativityValue');
  
  if (generateBtn) generateBtn.addEventListener('click', () => generateContent());
  if (regenerateBtn) regenerateBtn.addEventListener('click', () => generateContent());
  if (copyBtn) copyBtn.addEventListener('click', () => copyToClipboard());
  if (downloadBtn) downloadBtn.addEventListener('click', () => downloadContent());
  
  if (creativitySlider && creativityValue) {
    creativitySlider.addEventListener('input', function(e) {
      creativityValue.textContent = e.target.value;
    });
  }
  
  console.log('Content generator initialized');
}

function generateContent() {
  const contentType = document.getElementById('contentType')?.value || 'story';
  const theme = document.getElementById('contentTheme')?.value.trim() || '';
  const length = document.getElementById('contentLength')?.value || 'medium';
  const creativity = document.getElementById('creativitySlider')?.value || 7;
  
  const loading = document.getElementById('generateLoading');
  const contentSection = document.getElementById('generatedContent');
  const regenerateBtn = document.getElementById('regenerateContent');
  
  if (loading) loading.style.display = 'block';
  if (contentSection) contentSection.style.display = 'none';
  
  setTimeout(() => {
    const content = createGeneratedContent(contentType, theme, length, creativity);
    displayGeneratedContent(content);
    
    if (loading) loading.style.display = 'none';
    if (contentSection) {
      contentSection.style.display = 'block';
      contentSection.classList.add('fade-in');
    }
    if (regenerateBtn) regenerateBtn.style.display = 'inline-block';
  }, 2500 + Math.random() * 1500);
}

function createGeneratedContent(type, theme, length, creativity) {
  const templates = appData.textTemplates[type] || appData.textTemplates.story;
  let template = templates[Math.floor(Math.random() * templates.length)];
  
  // Replace placeholders with theme-based content
  const replacements = {
    '{character}': theme ? `${theme} enthusiast` : 'brave adventurer',
    '{goal}': theme ? `mastering ${theme}` : 'discovering new worlds',
    '{action}': theme ? `study ${theme}` : 'explore unknown territories',
    '{year}': `${2020 + Math.floor(Math.random() * 10)}`,
    '{setting}': theme ? `${theme} laboratory` : 'mystical forest',
    '{item}': theme ? `${theme} manual` : 'ancient map',
    '{emotion}': creativity > 7 ? 'boundless curiosity' : 'quiet determination',
    '{location}': theme ? `${theme} research center` : 'hidden cave',
    '{object}': theme ? `${theme} artifact` : 'glowing crystal',
    '{topic}': theme || 'innovation',
    '{field}': theme ? `${theme} studies` : 'modern science',
    '{process}': theme ? `${theme} methodology` : 'systematic analysis',
    '{principles}': theme ? `core ${theme} concepts` : 'fundamental laws',
    '{applications}': theme ? `${theme} implementations` : 'practical solutions',
    '{fact1}': `It significantly impacts modern technology`,
    '{fact2}': `Research shows promising developments`,
    '{fact3}': `Future applications are expanding rapidly`,
    '{outcome}': theme ? `advanced ${theme} systems` : 'innovative solutions',
    '{area1}': 'technological advancement',
    '{area2}': 'social progress',
    '{area3}': 'economic development'
  };
  
  Object.entries(replacements).forEach(([placeholder, replacement]) => {
    template = template.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), replacement);
  });
  
  // Expand based on length setting
  let content = template;
  if (length === 'medium') {
    content += ` As the story unfolds, we discover deeper connections and meaningful relationships that shape the narrative in unexpected ways.`;
  } else if (length === 'long') {
    content += ` The journey continues with remarkable discoveries and challenges that test the limits of understanding. Each step reveals new layers of complexity and wonder, creating a rich tapestry of experience that resonates with timeless themes of growth, discovery, and transformation. The implications extend far beyond the immediate context, touching on universal questions about purpose, meaning, and the endless pursuit of knowledge.`;
  }
  
  return {
    text: content,
    wordCount: content.split(/\s+/).length,
    readTime: Math.ceil(content.split(/\s+/).length / 200),
    creativity: creativity,
    type: type
  };
}

function displayGeneratedContent(content) {
  const contentDisplay = document.getElementById('contentDisplay');
  const metricsContainer = document.getElementById('contentMetrics');
  
  if (contentDisplay) {
    contentDisplay.innerHTML = content.text;
  }
  
  if (metricsContainer) {
    metricsContainer.innerHTML = `
      <div class="metric-item">
        <span class="stat-number">${content.wordCount}</span>
        <span class="stat-label">Words</span>
      </div>
      <div class="metric-item">
        <span class="stat-number">${content.readTime} min</span>
        <span class="stat-label">Read Time</span>
      </div>
      <div class="metric-item">
        <span class="stat-number">${content.creativity}/10</span>
        <span class="stat-label">Creativity</span>
      </div>
      <div class="metric-item">
        <span class="stat-number">${content.type}</span>
        <span class="stat-label">Type</span>
      </div>
    `;
  }
}

function copyToClipboard() {
  const contentDisplay = document.getElementById('contentDisplay');
  if (contentDisplay && contentDisplay.textContent) {
    navigator.clipboard.writeText(contentDisplay.textContent).then(() => {
      showMessage('Content copied to clipboard!', 'success');
    }).catch(() => {
      showMessage('Failed to copy content', 'error');
    });
  }
}

function downloadContent() {
  const contentDisplay = document.getElementById('contentDisplay');
  if (contentDisplay && contentDisplay.textContent) {
    const content = contentDisplay.textContent;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-content.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage('Content downloaded successfully!', 'success');
  }
}

// Multi-Modal Functions - Fixed
function initializeMultiModal() {
  console.log('Initializing multi-modal...');
  
  const imageUpload = document.getElementById('multiModalImageUpload');
  const imageInput = document.getElementById('multiModalImageInput');
  const analyzeBtn = document.getElementById('analyzeMultiModal');
  const clearBtn = document.getElementById('clearMultiModal');
  const exportBtn = document.getElementById('exportReport');
  
  if (imageUpload && imageInput) {
    imageUpload.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', handleMultiModalImage);
  }
  
  if (analyzeBtn) analyzeBtn.addEventListener('click', () => performMultiModalAnalysis());
  if (clearBtn) clearBtn.addEventListener('click', () => clearMultiModal());
  if (exportBtn) exportBtn.addEventListener('click', () => exportMultiModalReport());
  
  console.log('Multi-modal initialized');
}

function handleMultiModalImage(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imageElement = document.getElementById('multiModalImage');
      if (imageElement) {
        imageElement.src = e.target.result;
        imageElement.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  }
}

function performMultiModalAnalysis() {
  const image = document.getElementById('multiModalImage');
  const text = document.getElementById('multiModalText')?.value.trim() || '';
  
  if ((!image || !image.src) && !text) {
    showMessage('Please provide both image and text for multi-modal analysis', 'error');
    return;
  }
  
  const loading = document.getElementById('multiModalLoading');
  const results = document.getElementById('multiModalResults');
  
  if (loading) loading.style.display = 'block';
  if (results) results.style.display = 'none';
  
  setTimeout(() => {
    const analysis = generateMultiModalAnalysis(image?.src || '', text);
    displayMultiModalResults(analysis);
    createCorrelationChart(analysis.correlations);
    
    if (loading) loading.style.display = 'none';
    if (results) {
      results.style.display = 'block';
      results.classList.add('fade-in');
    }
  }, 3000 + Math.random() * 2000);
}

function generateMultiModalAnalysis(imageSrc, text) {
  return {
    sceneUnderstanding: `Cross-modal analysis reveals strong correlations between visual elements and textual context. The image provides spatial and visual information that complements the semantic content of the text, creating a comprehensive understanding of the subject matter.`,
    contextualInsights: `The combination of visual and textual data enhances interpretation accuracy by 34%. Key contextual relationships have been identified, showing how visual cues support and extend the meaning conveyed in the text.`,
    correlations: {
      'Visual-Textual': 0.87,
      'Semantic Alignment': 0.92,
      'Contextual Relevance': 0.78,
      'Content Coherence': 0.85
    },
    report: `## Multi-Modal Analysis Report\n\n**Analysis Overview:**\nThis comprehensive analysis combines computer vision and natural language processing to provide deep insights into the relationship between visual and textual content.\n\n**Key Findings:**\n- Strong semantic alignment between image and text\n- High contextual relevance score of 78%\n- Enhanced understanding through multi-modal fusion\n- Robust cross-modal correlations identified\n\n**Recommendations:**\nThe multi-modal approach significantly improves content understanding and provides richer insights than single-modal analysis alone.`
  };
}

function displayMultiModalResults(analysis) {
  const sceneElement = document.getElementById('sceneUnderstanding');
  const insightsElement = document.getElementById('contextualInsights');
  const reportElement = document.getElementById('generatedReport');
  
  if (sceneElement) sceneElement.innerHTML = analysis.sceneUnderstanding;
  if (insightsElement) insightsElement.innerHTML = analysis.contextualInsights;
  if (reportElement) reportElement.innerHTML = `<pre>${analysis.report}</pre>`;
}

function createCorrelationChart(correlations) {
  const canvas = document.getElementById('correlationChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  if (charts.correlation) {
    charts.correlation.destroy();
  }
  
  charts.correlation = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: Object.keys(correlations),
      datasets: [{
        label: 'Correlation Score',
        data: Object.values(correlations),
        backgroundColor: 'rgba(31, 184, 205, 0.2)',
        borderColor: '#1FB8CD',
        borderWidth: 2,
        pointBackgroundColor: '#1FB8CD'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 1,
          ticks: {
            stepSize: 0.2
          }
        }
      }
    }
  });
}

function clearMultiModal() {
  const image = document.getElementById('multiModalImage');
  const text = document.getElementById('multiModalText');
  const results = document.getElementById('multiModalResults');
  const input = document.getElementById('multiModalImageInput');
  
  if (image) image.style.display = 'none';
  if (text) text.value = '';
  if (results) results.style.display = 'none';
  if (input) input.value = '';
}

function exportMultiModalReport() {
  const reportElement = document.getElementById('generatedReport');
  if (reportElement && reportElement.textContent) {
    const report = reportElement.textContent;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'multimodal-analysis-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage('Report exported successfully!', 'success');
  }
}

// Project Info Functions
function initializeProjectInfo() {
  console.log('Initializing project info...');
  setTimeout(() => createPerformanceChart(), 500);
}

function createPerformanceChart() {
  const canvas = document.getElementById('performanceChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  charts.performance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Object Detection', 'Sentiment Analysis', 'Text Generation', 'Image Classification'],
      datasets: [{
        label: 'Accuracy (%)',
        data: [92.3, 88.7, 85.4, 91.2],
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F'],
        borderColor: ['#218BCC', '#E6A870', '#A13A36', '#527377'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

// Utility Functions
function showMessage(message, type = 'info') {
  console.log(`${type.toUpperCase()}: ${message}`);
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `${type}-message`;
  messageDiv.textContent = message;
  messageDiv.style.position = 'fixed';
  messageDiv.style.top = '20px';
  messageDiv.style.right = '20px';
  messageDiv.style.zIndex = '1000';
  messageDiv.style.padding = '12px 16px';
  messageDiv.style.borderRadius = '8px';
  messageDiv.style.fontWeight = '500';
  messageDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 3000);
}

// Initialize charts on window resize
window.addEventListener('resize', function() {
  Object.values(charts).forEach(chart => {
    if (chart && typeof chart.resize === 'function') {
      chart.resize();
    }
  });
});