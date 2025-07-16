  tailwind.config = {
    theme: {
      extend: {
        colors: {
          "dark-bg": "#1a1a1a",
          "dark-panel": "#1d1d20",
          "dark-border": "#404040",
        },
        screens: {
          xs: "320px",
          sm: "481px",
          md: "768px",
          lg: "1025px",
          xl: "1281px",
          "2xl": "1441px",
          "3xl": "1921px",
          "4xl": "2561px",
          "5xl": "3841px",
        },
      },
    },
  };


// Modal functionality
const openModalBtn = document.getElementById("openModalBtn")
const backToCanvas = document.getElementById("backToCanvas")
const modalOverlay = document.getElementById("modalOverlay")

// Tab functionality
const parametersTab = document.getElementById("parametersTab")
const settingsTab = document.getElementById("settingsTab")
const parametersContent = document.getElementById("parametersContent")
const settingsContent = document.getElementById("settingsContent")

// Panel elements
const aiAgentPanel = document.getElementById("aiAgentPanel")
const inputPanel = document.getElementById("inputPanel")
const outputPanel = document.getElementById("outputPanel")
const leftResizeHandle = document.getElementById("leftResizeHandle")
const rightResizeHandle = document.getElementById("rightResizeHandle")

// Track active impression dropdowns - IMPORTANT: This must be declared at the top
const activeImpressionDropdowns = new Set()

// Open modal
openModalBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("hidden")
  document.body.style.overflow = "hidden"
})

// Close modal
function closeModal() {
  modalOverlay.classList.add("hidden")
  document.body.style.overflow = "auto"
}

backToCanvas.addEventListener("click", closeModal)

// Close modal when clicking overlay
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal()
  }
})

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalOverlay.classList.contains("hidden")) {
    closeModal()
  }
})

// Tab switching functionality
function switchTab(activeTab, inactiveTab, activeContent, inactiveContent) {
  // Update tab styles
  activeTab.classList.add(
    "border-orange-500",
    "text-orange-500",
    "border-b-2",
    "border-orange-400",
    "bg-orange-500",
    "bg-opacity-10",
  )
  activeTab.classList.remove("text-gray-400")

  inactiveTab.classList.remove(
    "border-orange-500",
    "text-orange-500",
    "border-b-2",
    "border-orange-400",
    "bg-orange-500",
    "bg-opacity-10",
  )
  inactiveTab.classList.add("text-gray-400")

  // Update content visibility
  activeContent.classList.remove("hidden")
  inactiveContent.classList.add("hidden")
}

parametersTab.addEventListener("click", () => {
  switchTab(parametersTab, settingsTab, parametersContent, settingsContent)
})

settingsTab.addEventListener("click", () => {
  switchTab(settingsTab, parametersTab, settingsContent, parametersContent)
})

// Resize functionality - Only works on larger screens
let isResizing = false
let resizeDirection = ""
let startX = 0
let startWidth = 0

function startResize(e, direction) {
  // Only allow resizing on xl screens and above
  if (window.innerWidth < 1280) return

  isResizing = true
  resizeDirection = direction
  startX = e.clientX
  startWidth = aiAgentPanel.offsetWidth
  document.addEventListener("mousemove", handleResize)
  document.addEventListener("mouseup", stopResize)
  e.preventDefault()
}

function handleResize(e) {
  if (!isResizing || window.innerWidth < 1280) return

  const deltaX = e.clientX - startX
  let newWidth = startWidth

  if (resizeDirection === "left") {
    newWidth = startWidth - deltaX
    // Expand over input panel
    if (newWidth > startWidth) {
      aiAgentPanel.style.marginLeft = `-${newWidth - startWidth}px`
      aiAgentPanel.style.width = `${newWidth}px`
    }
  } else if (resizeDirection === "right") {
    newWidth = startWidth + deltaX
    // Expand over output panel
    if (newWidth > startWidth) {
      aiAgentPanel.style.marginRight = `-${newWidth - startWidth}px`
      aiAgentPanel.style.width = `${newWidth}px`
    }
  }
}

function stopResize() {
  isResizing = false
  resizeDirection = ""
  document.removeEventListener("mousemove", handleResize)
  document.removeEventListener("mouseup", stopResize)
}

// Only add resize listeners if elements exist
if (leftResizeHandle) {
  leftResizeHandle.addEventListener("mousedown", (e) => startResize(e, "left"))
}
if (rightResizeHandle) {
  rightResizeHandle.addEventListener("mousedown", (e) => startResize(e, "right"))
}

// Reset panel sizes on window resize
window.addEventListener("resize", () => {
  if (window.innerWidth < 1280) {
    aiAgentPanel.style.marginLeft = ""
    aiAgentPanel.style.marginRight = ""
    aiAgentPanel.style.width = ""
  }
})

// Prevent modal close when clicking inside modal content
const modalContent = document.querySelector(".max-w-8xl") || document.querySelector(".modal-container")
if (modalContent) {
  modalContent.addEventListener("click", (e) => {
    e.stopPropagation()
  })
}

function initializeDropdown(id) {
  const customSelectBtn = document.getElementById(`customSelectBtn${id}`)
  const customOptionsMenu = document.getElementById(`customOptionsMenu${id}`)
  const selectedText = document.getElementById(`selectedText${id}`)
  const selectArrow = document.getElementById(`selectArrow${id}`)
  const nativeSelect = document.getElementById(`agentSelect${id}`)

  if (!customSelectBtn || !customOptionsMenu || !selectedText || !nativeSelect) return

  // Set initial highlight based on native <select> value
  const selectedValue = nativeSelect.value
  selectedText.textContent = selectedValue

  customOptionsMenu.querySelectorAll(".custom-option").forEach((option) => {
    const value = option.getAttribute("data-value")
    const h3 = option.querySelector("h3")
    if (h3) {
      if (value === selectedValue) {
        h3.classList.add("text-orange-500")
        h3.classList.remove("text-white")
      } else {
        h3.classList.remove("text-orange-500")
        h3.classList.add("text-white")
      }
    }
  })

  // Handle dropdown toggle
  customSelectBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    const isOpen = !customOptionsMenu.classList.contains("hidden")
    customOptionsMenu.classList.toggle("hidden")
    if (selectArrow) {
      selectArrow.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)"
    }
  })

  // Handle selection
  customOptionsMenu.querySelectorAll(".custom-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation()
      const value = option.getAttribute("data-value")
      selectedText.textContent = value
      nativeSelect.value = value
      customOptionsMenu.classList.add("hidden")
      if (selectArrow) {
        selectArrow.style.transform = "rotate(0deg)"
      }

      // Highlight selected option
      customOptionsMenu.querySelectorAll("h3").forEach((h3) => {
        h3.classList.remove("text-orange-500")
        h3.classList.add("text-white")
      })
      const h3 = option.querySelector("h3")
      if (h3) {
        h3.classList.remove("text-white")
        h3.classList.add("text-orange-500")
      }
    })
  })
}

//Toggle fucntionality
function initializeToggle(id) {
  const fixedBtn = document.getElementById(`fixedBtn${id}`)
  const impressionBtn = document.getElementById(`impressionBtn${id}`)
  const fixedSection = document.getElementById(`fixedSection${id}`)
  const impressionSection = document.getElementById(`impressionSection${id}`)
  const tabIndicator = document.getElementById(`tabIndicator${id}`)

  if (!fixedBtn || !impressionBtn) return

  fixedBtn.addEventListener("click", (e) => {
    e.stopPropagation() // Prevent global click handler
    if (tabIndicator) tabIndicator.style.left = "0"
    if (fixedSection) fixedSection.classList.remove("hidden")
    if (impressionSection) impressionSection.classList.add("hidden")
    console.log("Fixed button clicked")
    fixedBtn.classList.add("text-white")
    impressionBtn.classList.remove("text-white")
    impressionBtn.classList.add("text-gray-400")
  })

  impressionBtn.addEventListener("click", (e) => {
    e.stopPropagation() // Prevent global click handler
    if (tabIndicator) tabIndicator.style.left = "50%"
    if (fixedSection) fixedSection.classList.add("hidden")
    if (impressionSection) impressionSection.classList.remove("hidden")
    console.log("Impression button clicked")
    impressionBtn.classList.add("text-white")
    fixedBtn.classList.remove("text-white")
    fixedBtn.classList.add("text-gray-400")
  })
}

function initializeImpressionInput(id) {
  const input = document.getElementById(`impressionInput${id}`)
  const dropdown = document.getElementById(`impressionDropdown${id}`)
  const result = document.getElementById(`impressionResult${id}`)

  if (!input || !dropdown || !result) return

  // Show dropdown with slight delay to avoid race with outside click
  const showDropdown = () => {
    setTimeout(() => {
      dropdown.classList.remove("hidden")
    }, 50) // can be 0–50ms
  }

  const hideDropdown = () => {
    dropdown.classList.add("hidden")
  }

  input.addEventListener("focus", (e) => {
    e.stopPropagation()
    showDropdown()
  })

  input.addEventListener("click", (e) => {
    e.stopPropagation()
    showDropdown()
  })

  input.addEventListener("blur", (e) => {
    e.stopPropagation()
    hideDropdown()
  })

  input.addEventListener("input", (e) => {
    e.stopPropagation()
    result.textContent = input.value || "[Execute previous nodes for preview]"
    showDropdown()
  })

  dropdown.addEventListener("click", (e) => e.stopPropagation())
}

// Enhanced global click handler
document.addEventListener("click", (e) => {
  console.log("🌍 Global click: ", e.target)

  // 1. Close custom dropdowns
  document.querySelectorAll('[id^="customOptionsMenu"]').forEach((menu) => {
    const button = document.querySelector(`[id^="customSelectBtn"][id$="${menu.id.replace("customOptionsMenu", "")}"]`)
    if (button && !menu.contains(e.target) && !button.contains(e.target)) {
      menu.classList.add("hidden")
    }
  })

  // 2. Close impression dropdowns
  const input = document.getElementById("impressionInput2")
  const dropdown = document.getElementById("impressionDropdown2")
  if (input && dropdown && !input.contains(e.target) && !dropdown.contains(e.target)) {
    console.log("🎯 Click outside dropdown → hiding it.")
    dropdown.classList.add("hidden")
  }

  // 3. Reset dropdown arrows
  document.querySelectorAll('[id^="selectArrow"]').forEach((arrow) => {
    arrow.style.transform = "rotate(0deg)"
  })

  // 4. Close Add Option dropdown
  const addOptionBtn = document.getElementById("addOptionBtn")
  const addOptionDropdown = document.getElementById("addOptionDropdown")
  if (addOptionBtn && addOptionDropdown && !addOptionBtn.contains(e.target) && !addOptionDropdown.contains(e.target)) {
    addOptionDropdown.classList.add("hidden")
  }
})

// Initialize all components
initializeDropdown(1)
initializeDropdown(2)
initializeToggle(2)
initializeImpressionInput(2)

// Initialize Require Specific Output Format output format toggle
function initializeOutputFormatToggle() {
  const toggle = document.getElementById("outputFormatToggle")
  const content = document.getElementById("outputFormatContent")

  if (!toggle || !content) return

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      content.classList.remove("hidden")
    } else {
      content.classList.add("hidden")
    }
  })
}

// Add this call after your existing initialize calls
initializeOutputFormatToggle()

// Add Option functionality
let activeOptions = ["system-message"] // System Message is active by default
let optionCounter = 1

function initializeAddOption() {
  const addOptionBtn = document.getElementById("addOptionBtn")
  const addOptionDropdown = document.getElementById("addOptionDropdown")
  const addOptionContainer = document.getElementById("addOptionContainer")
  const dynamicContainer = document.getElementById("dynamicOptionsContainer")
  const addOptionItems = document.querySelectorAll(".add-option-item")

  if (!addOptionBtn || !addOptionDropdown || !addOptionContainer || !dynamicContainer) {
    return
  }

  // Add default System Message
  addOptionSection("system-message", optionCounter++)
  updateAddOptionVisibility()

  // Toggle dropdown
  addOptionBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    addOptionDropdown.classList.toggle("hidden")
    updateDropdownOptions()
  })

  // Handle option selection
  addOptionItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const optionType = e.currentTarget.getAttribute("data-option") // ← this ensures you get the button
      if (!activeOptions.includes(optionType)) {
        activeOptions.push(optionType)
        addOptionSection(optionType, optionCounter++)
        addOptionDropdown.classList.add("hidden")
        updateDropdownOptions()
        updateAddOptionVisibility()
      }
    })
  })
}

function updateDropdownOptions() {
  const addOptionItems = document.querySelectorAll(".add-option-item")
  addOptionItems.forEach((item) => {
    const optionType = item.getAttribute("data-option")
    if (activeOptions.includes(optionType)) {
      item.style.display = "none"
    } else {
      item.style.display = "block"
    }
  })
}

function updateAddOptionVisibility() {
  const addOptionContainer = document.getElementById("addOptionContainer")
  const availableOptions = [
    "system-message",
    "max-iterations",
    "return-intermediate-steps",
    "automatically-passthrough-binary-images",
  ]
  const remainingOptions = availableOptions.filter((option) => !activeOptions.includes(option))

  if (remainingOptions.length === 0) {
    addOptionContainer.style.display = "none"
  } else {
    addOptionContainer.style.display = "block"
  }
}

function addOptionSection(optionType, id) {
  const container = document.getElementById("dynamicOptionsContainer")

  // Tooltip messages for each option type
  const tooltipMessages = {
    "system-message": "The message that will be sent to the agent before the conversation starts",
    "max-iterations": "Maximum number of iterations the agent can perform before stopping",
    "return-intermediate-steps": "Whether to return intermediate steps in the agent's reasoning process",
    "automatically-passthrough-binary-images": "Automatically pass through binary image data without processing",
  }

  const optionLabels = {
    "system-message": "System Message",
    "max-iterations": "Max Iterations",
    "return-intermediate-steps": "Return Intermediate Steps",
    "automatically-passthrough-binary-images": "Automatically Passthrough Binary Images",
  }

  // Create tooltip HTML for all options
  const tooltipHTML = `
    <div class="tooltip-container option-label">
      <span class="help-icon">
        <svg class="w-4 h-4 text-gray-400 hover:text-orange-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
        </svg>
      </span>
      <div class="tooltip">
        ${tooltipMessages[optionType]}
      </div>
    </div>
  `

  const sectionHTML = `
    <div class="space-y-2 dropdown-section option-section relative" data-option="${optionType}" data-id="${id}">
      <!-- Section Indicator -->
      <div id="sectionIndicator${id}" class="section-indicator hidden"></div>
      
      <!-- Delete button (appears on hover) -->
      <button class="delete-btn option-controls" onclick="removeOptionSection('${optionType}', ${id})">
        ×
      </button>
      
      <div class="flex items-center justify-between relative">
        <div class="flex items-center">
          <label class="text-xs xs:text-sm font-medium text-white">${optionLabels[optionType]}</label>
          ${tooltipHTML}
        </div>
        <div class="flex items-center gap-1 hover-controls option-controls">
          <button class="text-gray-400 hover:text-orange-500">
            <svg class="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
            </svg>
          </button>
          <div class="flex items-center bg-gray-600 rounded overflow-hidden relative">
            <div id="tabIndicator${id}" class="tab-indicator" style="left: 0; width: 50%"></div>
            <button id="fixedBtn${id}" class="px-1 py-1 text-xs text-white hover:bg-gray-500 transition-colors tab-button flex-1">
              Fixed
            </button>
            <button id="impressionBtn${id}" class="px-1 py-1 text-xs text-gray-400 hover:bg-gray-500 transition-colors tab-button flex-1">
              Impression
            </button>
          </div>
        </div>
      </div>

      ${getOptionContent(optionType, id)}
    </div>
  `

  container.insertAdjacentHTML("beforeend", sectionHTML)

  // Use requestAnimationFrame to ensure DOM is updated
  requestAnimationFrame(() => {
    // Initialize toggle for this section
    initializeToggle(id)

    if (optionType === "system-message") {
      initializeImpressionInput(id)
    }
    if (optionType === "return-intermediate-steps") {
      initializeToggleSwitch(`returnStepsToggle${id}`, `returnStepsContent${id}`)
    }
    if (optionType === "automatically-passthrough-binary-images") {
      initializeToggleSwitch(`binaryImagesToggle${id}`, `binaryImagesContent${id}`)
    }
  })
}

function getOptionContent(optionType, id) {
  switch (optionType) {
    case "system-message":
      return `
        <!-- Fixed Section Content (Default) -->
        <div id="fixedSection${id}" class="relative">
          <div class="bg-[#2a2a2a] border border-gray-600 rounded-lg overflow-hidden">
            <div class="flex">
              <div class="w-8 xs:w-12 bg-gray-600 border-r border-gray-500 flex items-center justify-center">
                <span class="text-gray-300 text-xs xs:text-sm font-mono">fx</span>
              </div>
              <div class="flex-1 relative">
                <textarea id="systemMessageTextarea${id}" class="w-full px-3 py-2 xs:px-4 xs:py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset resize-none min-h-[100px] xs:min-h-[120px] text-xs xs:text-sm font-mono pr-6 xs:pr-8" placeholder="### **Output Format:**">### **Output Format:**
- Provide the result **strictly in JSON format** with a single port representative.</textarea>
                <button class="absolute bottom-1 right-1 xs:bottom-2 xs:right-2 text-gray-400 hover:text-orange-500 transition-colors bg-gray-700 rounded p-1">
                  <svg class="w-3 h-3 xs:w-4 xs:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div id="impressionSection${id}" class="relative hidden">
          <div class="bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
            <div class="flex">
              <div class="w-8 xs:w-12 bg-gray-600 border-r border-gray-500 flex items-center justify-center">
                <span class="text-gray-300 text-xs xs:text-sm font-mono">fx</span>
              </div>
              <div class="flex-1 relative">
                <input type="text" id="impressionInput${id}" class="w-full px-3 py-2 xs:px-4 xs:py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset pr-6 xs:pr-8 text-xs xs:text-sm" placeholder="Enter expression..." />
                <button class="absolute right-1 top-1/2 transform -translate-y-1/2 xs:right-2 text-white hover:text-orange-500 transition-colors">
                  <svg class="w-3 h-3 xs:w-4 xs:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `

    case "max-iterations":
      return `
        <div id="fixedSection${id}" class="relative">
          <input type="number" class="w-full bg-gray-700 text-white px-3 py-1 xs:px-4 xs:py-1 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs xs:text-sm" placeholder="Enter max iterations..." />
        </div>
        <div id="impressionSection${id}" class="relative hidden">
          <div class="bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
            <div class="flex">
              <div class="w-8 xs:w-12 bg-gray-600 border-r border-gray-500 flex items-center justify-center">
                <span class="text-gray-300 text-xs xs:text-sm font-mono">fx</span>
              </div>
              <div class="flex-1 relative">
                <input type="text" class="w-full px-3 py-2 xs:px-4 xs:py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset pr-6 xs:pr-8 text-xs xs:text-sm" placeholder="Enter expression..." />
                <button class="absolute right-1 top-1/2 transform -translate-y-1/2 xs:right-2 text-gray-400 hover:text-orange-500 transition-colors">
                  <svg class="w-3 h-3 xs:w-4 xs:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `

    case "return-intermediate-steps":
      return `
        <div id="fixedSection${id}" class="relative">
          <div class="space-y-2 xs:space-y-3">
            <!-- Toggle Switch on second line -->
            <div class="flex justify-start">
              <div class="relative">
                <input type="checkbox" id="returnStepsToggle${id}" class="sr-only" />
                <label for="returnStepsToggle${id}" class="flex items-center cursor-pointer">
                  <div class="relative">
                    <div class="block bg-gray-600 w-6 h-3 xs:w-8 xs:h-4 rounded-full transition-colors duration-200"></div>
                    <div class="dot absolute left-0 top-0 bg-white w-3 h-3 xs:w-4 xs:h-4 rounded-full transition-transform duration-300"></div>
                  </div>
                </label>
              </div>
            </div>
            <!-- Expanded Content when toggle is ON -->
            <div id="returnStepsContent${id}" class="hidden space-y-3 xs:space-y-4">
              <div class="bg-amber-600 bg-opacity-20 border border-amber-500 rounded-lg p-3 xs:p-4">
                <p class="text-xs xs:text-sm text-amber-100">
                  Connect an <span class="text-amber-400 font-medium">output parser</span> on the canvas to specify the output format you require
                </p>
              </div>
            </div>
          </div>
        </div>
        <div id="impressionSection${id}" class="relative hidden">
          <div class="bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
            <div class="flex">
              <div class="w-8 xs:w-12 bg-gray-600 border-r border-gray-500 flex items-center justify-center">
                <span class="text-gray-300 text-xs xs:text-sm font-mono">fx</span>
              </div>
              <div class="flex-1 relative">
                <input type="text" class="w-full px-3 py-2 xs:px-4 xs:py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset pr-6 xs:pr-8 text-xs xs:text-sm" placeholder="Enter expression..." />
                <button class="absolute right-1 top-1/2 transform -translate-y-1/2 xs:right-2 text-gray-400 hover:text-orange-500 transition-colors">
                  <svg class="w-3 h-3 xs:w-4 xs:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `

    case "automatically-passthrough-binary-images":
      return `
        <div id="fixedSection${id}" class="relative">
          <div class="space-y-2 xs:space-y-3">
            <!-- Toggle Switch on second line -->
            <div class="flex justify-start">
              <div class="relative">
                <input type="checkbox" id="binaryImagesToggle${id}" class="sr-only" />
                <label for="binaryImagesToggle${id}" class="flex items-center cursor-pointer">
                  <div class="relative">
                    <div class="block bg-gray-600 w-6 h-3 xs:w-8 xs:h-4 rounded-full transition-colors duration-200"></div>
                    <div class="dot absolute left-0 top-0 bg-white w-3 h-3 xs:w-4 xs:h-4 rounded-full transition-transform duration-300"></div>
                  </div>
                </label>
              </div>
            </div>
            <!-- Expanded Content when toggle is ON -->
            <div id="binaryImagesContent${id}" class="hidden space-y-3 xs:space-y-4">
              <div class="bg-amber-600 bg-opacity-20 border border-amber-500 rounded-lg p-3 xs:p-4">
                <p class="text-xs xs:text-sm text-amber-100">
                  Connect an <span class="text-amber-400 font-medium">output parser</span> on the canvas to specify the output format you require
                </p>
              </div>
            </div>
          </div>
        </div>
        <div id="impressionSection${id}" class="relative hidden">
          <div class="bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
            <div class="flex">
              <div class="w-8 xs:w-12 bg-gray-600 border-r border-gray-500 flex items-center justify-center">
                <span class="text-gray-300 text-xs xs:text-sm font-mono">fx</span>
              </div>
              <div class="flex-1 relative">
                <input type="text" class="w-full px-3 py-2 xs:px-4 xs:py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset pr-6 xs:pr-8 text-xs xs:text-sm" placeholder="Enter expression..." />
                <button class="absolute right-1 top-1/2 transform -translate-y-1/2 xs:right-2 text-gray-400 hover:text-orange-500 transition-colors">
                  <svg class="w-3 h-3 xs:w-4 xs:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `
  }
}

function initializeToggleSwitch(toggleId, contentId) {
  const toggle = document.getElementById(toggleId)
  const content = document.getElementById(contentId)

  if (!toggle || !content) return

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      content.classList.remove("hidden")
    } else {
      content.classList.add("hidden")
    }
  })
}

function removeOptionSection(optionType, id) {
  const section = document.querySelector(`[data-option="${optionType}"][data-id="${id}"]`)
  if (section) {
    section.remove()
    activeOptions = activeOptions.filter((option) => option !== optionType)
    updateDropdownOptions()
    updateAddOptionVisibility()
  }
}

// Initialize the Add Option functionality
initializeAddOption()
