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

// Track active expression dropdowns - IMPORTANT: This must be declared at the top
const activeExpressionDropdowns = new Set()

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

      if (id === 2) {
      handlePromptSourceChange(value);
    }
    })
  })
}

//Toggle fucntionality
function initializeToggle(id) {
  const fixedBtn = document.getElementById(`fixedBtn${id}`)
  const expressionBtn = document.getElementById(`expressionBtn${id}`)
  const fixedSection = document.getElementById(`fixedSection${id}`)
  const expressionSection = document.getElementById(`expressionSection${id}`)
  const tabIndicator = document.getElementById(`tabIndicator${id}`)

  if (!fixedBtn || !expressionBtn) return

  fixedBtn.addEventListener("click", (e) => {
    e.stopPropagation() // Prevent global click handler
    if (tabIndicator) tabIndicator.style.left = "0"
    if (fixedSection) fixedSection.classList.remove("hidden")
    if (expressionSection) expressionSection.classList.add("hidden")
    console.log("Fixed button clicked")
    fixedBtn.classList.add("text-white")
    expressionBtn.classList.remove("text-white")
    expressionBtn.classList.add("text-gray-400")
  })

  expressionBtn.addEventListener("click", (e) => {
    e.stopPropagation() // Prevent global click handler
    if (tabIndicator) tabIndicator.style.left = "50%"
    if (fixedSection) fixedSection.classList.add("hidden")
    if (expressionSection) expressionSection.classList.remove("hidden")
    //console.log("expression button clicked")
  console.log("🟠 Expression button clicked for", id);
    expressionBtn.classList.add("text-white")
    fixedBtn.classList.remove("text-white")
    fixedBtn.classList.add("text-gray-400")
  })
}

function initializeExpressionInput(id) {
  const input = document.getElementById(`expressionInput${id}`)
  const dropdown = document.getElementById(`expressionDropdown${id}`)
  const result = document.getElementById(`expressionResult${id}`)
  //   const expressionBtn = document.getElementById(`expressionBtn${id}`);
  // const fixedBtn = document.getElementById(`fixedBtn${id}`);

  // console.log(`[initializeExpressionInput] id=${id}`, {
  //   expressionBtn,
  //   fixedBtn,
  //   input
  // });

  // if (!expressionBtn || !fixedBtn || !input) {
  //   console.warn(`❌ One or more elements missing for ID ${id}`);
  //   return;
  // }
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

// Initialize Prompt Message functionality
function initializePromptMessage() {
  const sourceDropdown = document.getElementById("customOptionsMenu2")
  const promptConnectedContent = document.getElementById("promptConnectedContent")
  const promptDefineContent = document.getElementById("promptDefineContent")
  const promptHoverControls = document.getElementById("promptHoverControls")
  const promptFixedBtn = document.getElementById("promptFixedBtn")
  const promptExpressionBtn = document.getElementById("promptExpressionBtn")
  const promptFixedSection = document.getElementById("promptFixedSection")
  const promptExpressionSection = document.getElementById("promptExpressionSection")
  const promptTabIndicator = document.getElementById("promptTabIndicator")

  if (!sourceDropdown || !promptConnectedContent || !promptDefineContent) {
    console.error("Prompt message elements not found")
    return
  }

  // Handle source dropdown selection changes
  sourceDropdown.addEventListener("click", (e) => {
    const option = e.target.closest(".custom-option")
    if (option) {
      const value = option.getAttribute("data-value")
      handlePromptSourceChange(value)
    }
  })

  // Initialize Fixed/Expression toggle for "Define below" mode
  if (promptFixedBtn && promptExpressionBtn) {
    promptFixedBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      console.log("Prompt Fixed button clicked")
      if (promptTabIndicator) promptTabIndicator.style.left = "0"
      if (promptFixedSection) promptFixedSection.classList.remove("hidden")
      if (promptExpressionSection) promptExpressionSection.classList.add("hidden")
      promptFixedBtn.classList.add("text-white")
      promptExpressionBtn.classList.remove("text-white")
      promptExpressionBtn.classList.add("text-gray-400")
    })

    promptExpressionBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      console.log("Prompt Expression button clicked")
      if (promptTabIndicator) promptTabIndicator.style.left = "50%"
      if (promptFixedSection) promptFixedSection.classList.add("hidden")
      if (promptExpressionSection) promptExpressionSection.classList.remove("hidden")
      promptExpressionBtn.classList.add("text-white")
      promptFixedBtn.classList.remove("text-white")
      promptFixedBtn.classList.add("text-gray-400")
    })
  }

  // Initialize expression input for prompt
  initializePromptExpressionInput()

  // Set initial state based on current selection
  const currentSelection = document.getElementById("selectedText2").textContent
  handlePromptSourceChange(currentSelection)
}

function handlePromptSourceChange(selectedValue) {
  const promptConnectedContent = document.getElementById("promptConnectedContent")
  const promptDefineContent = document.getElementById("promptDefineContent")
  const promptHoverControls = document.getElementById("promptHoverControls")

  console.log(`Prompt source changed to: ${selectedValue}`)

  if (selectedValue === "Connected Chat Trigger Node") {
    // Show connected content, hide define content and hover controls
    promptConnectedContent.classList.remove("hidden")
    promptDefineContent.classList.add("hidden")
    promptHoverControls.style.display = "none"
  } else if (selectedValue === "Define below") {
    // Show define content and hover controls, hide connected content
    promptConnectedContent.classList.add("hidden")
    promptDefineContent.classList.remove("hidden")
    promptHoverControls.style.display = "flex"
  }
}

function initializePromptExpressionInput() {
  const input = document.getElementById("promptExpressionInput")
  const dropdown = document.getElementById("promptExpressionDropdown")
  const result = document.getElementById("promptExpressionResult")

  if (!input || !dropdown || !result) {
    console.error("Prompt expression input elements not found")
    return
  }

  console.log("Initializing prompt expression input")

  const showDropdown = () => {
    setTimeout(() => {
      dropdown.classList.remove("hidden")
    }, 50)
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
  //console.log("🌍 Global click: ", e.target)

  // 1. Close custom dropdowns
  document.querySelectorAll('[id^="customOptionsMenu"]').forEach((menu) => {
    const button = document.querySelector(`[id^="customSelectBtn"][id$="${menu.id.replace("customOptionsMenu", "")}"]`)
    if (button && !menu.contains(e.target) && !button.contains(e.target)) {
      menu.classList.add("hidden")
    }
  })

  // 2. Close expression dropdowns
  const input = document.getElementById("expressionInput2")
  const dropdown = document.getElementById("expressionDropdown2")
  if (input && dropdown && !input.contains(e.target) && !dropdown.contains(e.target)) {
    //console.log("🎯 Click outside dropdown → hiding it.")
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
initializeExpressionInput(2)

initializeExpressionInput(2)

// Initialize Prompt Message functionality
initializePromptMessage()

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

console.log(`Initializing Add Option...${optionCounter}`)
  // Add default System Message
  addOptionSection("system-message", optionCounter++)
  updateAddOptionVisibility()
console.log(`Initializing Add Option...${optionCounter}`)

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
        console.log(`ActiveOption: ${activeOptions}`)
        console.log(`Added option: ${optionType} with ID ${optionCounter - 1}`)
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
console.log(`Adding option section: ${optionType} with ID ${id}`)
waitForElement(`#expressionBtn${id}`, 1000).then(() => {
  initializeToggle(id);
  initializeExpressionInput(id);
  console.log(`✅ Expression section fully ready: ${id}`);
}).catch(err => {
  console.warn(err.message);
});

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
        <svg class="text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <path d="M 46 13 C 44.35503 13 43 14.35503 43 16 L 43 18 L 32.265625 18 C 30.510922 18 28.879517 18.922811 27.976562 20.427734 L 26.433594 23 L 23 23 C 20.802666 23 19 24.802666 19 27 C 19 29.197334 20.802666 31 23 31 L 24.074219 31 L 27.648438 77.458984 C 27.88773 80.575775 30.504529 83 33.630859 83 L 66.369141 83 C 69.495471 83 72.11227 80.575775 72.351562 77.458984 L 75.925781 31 L 77 31 C 79.197334 31 81 29.197334 81 27 C 81 24.802666 79.197334 23 77 23 L 73.566406 23 L 72.023438 20.427734 C 71.120481 18.922811 69.489078 18 67.734375 18 L 57 18 L 57 16 C 57 14.35503 55.64497 13 54 13 L 46 13 z M 46 15 L 54 15 C 54.56503 15 55 15.43497 55 16 L 55 18 L 45 18 L 45 16 C 45 15.43497 45.43497 15 46 15 z M 32.265625 20 L 43.832031 20 A 1.0001 1.0001 0 0 0 44.158203 20 L 55.832031 20 A 1.0001 1.0001 0 0 0 56.158203 20 L 67.734375 20 C 68.789672 20 69.763595 20.551955 70.306641 21.457031 L 71.833984 24 L 68.5 24 A 0.50005 0.50005 0 1 0 68.5 25 L 73.5 25 L 77 25 C 78.116666 25 79 25.883334 79 27 C 79 28.116666 78.116666 29 77 29 L 23 29 C 21.883334 29 21 28.116666 21 27 C 21 25.883334 21.883334 25 23 25 L 27 25 L 61.5 25 A 0.50005 0.50005 0 1 0 61.5 24 L 28.166016 24 L 29.693359 21.457031 C 30.236405 20.551955 31.210328 20 32.265625 20 z M 64.5 24 A 0.50005 0.50005 0 1 0 64.5 25 L 66.5 25 A 0.50005 0.50005 0 1 0 66.5 24 L 64.5 24 z M 26.078125 31 L 73.921875 31 L 70.357422 77.306641 C 70.196715 79.39985 68.46881 81 66.369141 81 L 33.630859 81 C 31.53119 81 29.803285 79.39985 29.642578 77.306641 L 26.078125 31 z M 38 35 C 36.348906 35 35 36.348906 35 38 L 35 73 C 35 74.651094 36.348906 76 38 76 C 39.651094 76 41 74.651094 41 73 L 41 38 C 41 36.348906 39.651094 35 38 35 z M 50 35 C 48.348906 35 47 36.348906 47 38 L 47 73 C 47 74.651094 48.348906 76 50 76 C 51.651094 76 53 74.651094 53 73 L 53 69.5 A 0.50005 0.50005 0 1 0 52 69.5 L 52 73 C 52 74.110906 51.110906 75 50 75 C 48.889094 75 48 74.110906 48 73 L 48 38 C 48 36.889094 48.889094 36 50 36 C 51.110906 36 52 36.889094 52 38 L 52 63.5 A 0.50005 0.50005 0 1 0 53 63.5 L 53 38 C 53 36.348906 51.651094 35 50 35 z M 62 35 C 60.348906 35 59 36.348906 59 38 L 59 39.5 A 0.50005 0.50005 0 1 0 60 39.5 L 60 38 C 60 36.889094 60.889094 36 62 36 C 63.110906 36 64 36.889094 64 38 L 64 73 C 64 74.110906 63.110906 75 62 75 C 60.889094 75 60 74.110906 60 73 L 60 47.5 A 0.50005 0.50005 0 1 0 59 47.5 L 59 73 C 59 74.651094 60.348906 76 62 76 C 63.651094 76 65 74.651094 65 73 L 65 38 C 65 36.348906 63.651094 35 62 35 z M 38 36 C 39.110906 36 40 36.889094 40 38 L 40 73 C 40 74.110906 39.110906 75 38 75 C 36.889094 75 36 74.110906 36 73 L 36 38 C 36 36.889094 36.889094 36 38 36 z M 59.492188 41.992188 A 0.50005 0.50005 0 0 0 59 42.5 L 59 44.5 A 0.50005 0.50005 0 1 0 60 44.5 L 60 42.5 A 0.50005 0.50005 0 0 0 59.492188 41.992188 z" fill="currentColor"></path>
        </svg>
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
            <button id="expressionBtn${id}" class="px-1 py-1 text-xs text-gray-400 hover:bg-gray-500 transition-colors tab-button flex-1">
              Expression
            </button>
          </div>
        </div>
      </div>

      ${getOptionContent(optionType, id)}
    </div>
  `

  container.insertAdjacentHTML("beforeend", sectionHTML)

 function waitForElement(selector, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const intervalTime = 50;
    let timePassed = 0;

    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      } else if (timePassed > timeout) {
        clearInterval(interval);
        reject(new Error(`❌ Element ${selector} not found in ${timeout}ms`));
      }
      timePassed += intervalTime;
    }, intervalTime);
  });
 }


   //initializeToggle(id); // Run this immediately

// waitForElement(`#toggleExpression${id}`, 1000)
//   .then(() => {
//     if (optionType === "system-message" || optionType === "max-iterations") {
//       initializeExpressionInput(id);
//     }
//     if (optionType === "return-intermediate-steps") {
//       initializeToggleSwitch(`returnStepsToggle${id}`, `returnStepsContent${id}`);
//     }
//     if (optionType === "automatically-passthrough-binary-images") {
//       initializeToggleSwitch(`binaryImagesToggle${id}`, `binaryImagesContent${id}`);
//     }
//     console.log(`✅ Successfully initialized: ${optionType} with ID ${id}`);
//   })
//   .catch((err) => {
//     console.warn(`❌ ${err}`);
//   });


  requestAnimationFrame(() => {
  // Initialize toggle immediately
  initializeToggle(id)

  // Wait for DOM paint, then ensure the element is attached
  setTimeout(() => {
    requestAnimationFrame(() => {
      const expressionToggle = document.querySelector(`#expressionBtn${id}`)
      if (expressionToggle) {
        if (optionType === "system-message" || optionType === "max-iterations") {
          initializeExpressionInput(id)
        }
        if (optionType === "return-intermediate-steps") {
          initializeToggleSwitch(`returnStepsToggle${id}`, `returnStepsContent${id}`)
        }
        if (optionType === "automatically-passthrough-binary-images") {
          initializeToggleSwitch(`binaryImagesToggle${id}`, `binaryImagesContent${id}`)
        }
        console.log(`✅ Initialized after DOM ready: ${optionType} with ID ${id}`)
      } else {
        console.warn(`⚠️ toggleExpression${id} not found at init time.`)
      }
    })
  }, 0)
})

}

function getOptionContent(optionType, id) {
  console.log(`Generating content for option: ${optionType} with ID ${id}`)
  switch (optionType) {
    case "system-message":
      return `
        <!-- Fixed Section Content (Default) -->
        <div id="fixedSection${id}" class="relative flex bg-[#000814] border border-gray-600 rounded-lg overflow-hidden">
          <div class="w-6 xs:w-10 bg-gray-600 border-r border-gray-500 flex items-center justify-center">
            <span class="text-gray-300 text-xs xs:text-sm font-mono">fx</span>
          </div>
          <div class="flex-1 relative">
            <textarea id="systemMessageTextarea${id}" class="w-full px-2 py-1 xs:px-2 xs:py-1 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-inset resize-none min-h-[100px] xs:min-h-[120px] text-xs xs:text-sm font-mono pr-6 xs:pr-8" placeholder="### **Output Format:**">### **Output Format:**
- Provide the result **strictly in JSON format** with a single port representative.</textarea>
            <button class="absolute bottom-1 right-1 xs:bottom-2 xs:right-2 text-gray-400 hover:text-orange-500 transition-colors rounded p-1">
              <svg class="w-3 h-3 xs:w-4 xs:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </button>
          </div>
        </div>
        <div id="expressionSection${id}" class="relative z-10 hidden">
          <div class="relative">
            <div
              class="flex items-center bg-[#000814] border border-gray-600 rounded-md overflow-hidden border border-gray-500"
            >
              <div
                class="px-2 py-1.5 xs:px-2 xs:py-1.5 bg-gray-600 border-r border-gray-500 italic text-gray-300 text-xs xs:text-sm"
              >
                fx
              </div>
              <input
                type="text"
                id="expressionInput${id}"
                class="flex-1 px-2 py-1 xs:px-2 xs:py-1 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-inset text-sm xs:text-base"
                placeholder="Enter expression..."
              />
              <button
                class="px-2 py-1 xs:px-3 xs:py-1 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <svg
                  class="w-3 h-3 xs:w-4 xs:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              id="expressionDropdown${id}"
              class="absolute top-full left-0 right-0 mt-1 bg-[#000814] border border-gray-600 rounded-md shadow-lg z-10"
            >
              <div class="p-3 xs:p-4">
                <div
                  class="flex items-center justify-between mb-2 xs:mb-3"
                >
                  <div
                    class="text-white text-xs xs:text-sm font-medium"
                  >
                    Result
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-400 text-xs xs:text-sm"
                      >Item</span
                    >
                    <span
                      class="bg-gray-600 text-white text-xs px-2 py-1 rounded"
                      >0</span
                    >
                  </div>
                </div>
                <div class="mb-2 xs:mb-3">
                  <div
                    id="expressionResult2"
                    class="text-gray-300 text-xs xs:text-sm"
                  >
                    [Execute previous nodes for preview]
                  </div>
                </div>
                <div
                  class="border-t border-gray-600 pt-2 xs:pt-3"
                >
                  <div class="text-gray-400 text-xs">
                    <span class="font-medium">Tip:</span> Execute
                    previous nodes to use input data
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `

    case "max-iterations":
      return `
        <div id="fixedSection${id}" class="relative">
          <input type="number" class="w-full bg-[#000814] text-white px-2 py-2 xs:px-2 xs:py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-inset text-xs xs:text-sm" placeholder="Enter max iterations..." />
        </div>
        <div id="expressionSection${id}" class="relative z-10 hidden">
          <div class="relative">
            <div
              class="flex items-center bg-[#000814] border border-gray-600 rounded-md overflow-hidden border border-gray-500"
            >
              <div
                class="px-2 py-1.5 xs:px-2 xs:py-1.5 bg-gray-600 border-r border-gray-500 italic text-gray-300 text-xs xs:text-sm"
              >
                fx
              </div>
              <input
                type="text"
                id="expressionInput${id}"
                class="flex-1 px-2 py-1 xs:px-2 xs:py-1 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-inset text-sm xs:text-base"
                placeholder="Enter expression..."
              />
              <button
                class="px-2 py-1 xs:px-3 xs:py-1 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <svg
                  class="w-3 h-3 xs:w-4 xs:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              id="expressionDropdown${id}"
              class="absolute top-full left-0 right-0 mt-1 bg-[#000814] border border-gray-600 rounded-md shadow-lg z-10"
            >
              <div class="p-3 xs:p-4">
                <div
                  class="flex items-center justify-between mb-2 xs:mb-3"
                >
                  <div
                    class="text-white text-xs xs:text-sm font-medium"
                  >
                    Result
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-400 text-xs xs:text-sm"
                      >Item</span
                    >
                    <span
                      class="bg-gray-600 text-white text-xs px-2 py-1 rounded"
                      >0</span
                    >
                  </div>
                </div>
                <div class="mb-2 xs:mb-3">
                  <div
                    id="expressionResult2"
                    class="text-gray-300 text-xs xs:text-sm"
                  >
                    [Execute previous nodes for preview]
                  </div>
                </div>
                <div
                  class="border-t border-gray-600 pt-2 xs:pt-3"
                >
                  <div class="text-gray-400 text-xs">
                    <span class="font-medium">Tip:</span> Execute
                    previous nodes to use input data
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `

    case "return-intermediate-steps":
      return `
        <div id="fixedSection${id}" class="relative">
            <!-- Toggle Switch on second line -->
            <div class="flex justify-start">
              <div class="relative">
                <input type="checkbox" id="returnStepsToggle${id}" class="sr-only" />
                <label for="returnStepsToggle${id}" class="flex items-center cursor-pointer">
                  <div class="relative">
                    <div class="block bg-gray-600 w-6 h-3 xs:w-9 xs:h-4 rounded-full transition-colors duration-200"></div>
                    <div class="dot absolute left-0 top-0 bg-white w-3 h-3 xs:w-4 xs:h-4 rounded-full transition-transform duration-300"></div>
                  </div>
                </label>
              </div>
            </div>
        </div>
        <div id="expressionSection${id}" class="relative z-10 hidden">
          <div class="relative">
            <div
              class="flex items-center bg-[#000814] border border-gray-600 rounded-md overflow-hidden border border-gray-500"
            >
              <div
                class="px-2 py-1.5 xs:px-2 xs:py-1.5 bg-gray-600 border-r border-gray-500 italic text-gray-300 text-xs xs:text-sm"
              >
                fx
              </div>
              <input
                type="text"
                id="expressionInput${id}"
                class="flex-1 px-2 py-1 xs:px-2 xs:py-1 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-inset text-sm xs:text-base"
                placeholder="Enter expression..."
              />
              <button
                class="px-2 py-1 xs:px-3 xs:py-1 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <svg
                  class="w-3 h-3 xs:w-4 xs:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              id="expressionDropdown${id}"
              class="absolute top-full left-0 right-0 mt-1 bg-[#000814] border border-gray-600 rounded-md shadow-lg z-10"
            >
              <div class="p-3 xs:p-4">
                <div
                  class="flex items-center justify-between mb-2 xs:mb-3"
                >
                  <div
                    class="text-white text-xs xs:text-sm font-medium"
                  >
                    Result
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-400 text-xs xs:text-sm"
                      >Item</span
                    >
                    <span
                      class="bg-gray-600 text-white text-xs px-2 py-1 rounded"
                      >0</span
                    >
                  </div>
                </div>
                <div class="mb-2 xs:mb-3">
                  <div
                    id="expressionResult2"
                    class="text-gray-300 text-xs xs:text-sm"
                  >
                    [Execute previous nodes for preview]
                  </div>
                </div>
                <div
                  class="border-t border-gray-600 pt-2 xs:pt-3"
                >
                  <div class="text-gray-400 text-xs">
                    <span class="font-medium">Tip:</span> Execute
                    previous nodes to use input data
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `

    case "automatically-passthrough-binary-images":
      return `
        <div id="fixedSection${id}" class="relative">
            <!-- Toggle Switch on second line -->
            <div class="flex justify-start">
              <div class="relative">
                <input type="checkbox" id="binaryImagesToggle${id}" class="sr-only" />
                <label for="binaryImagesToggle${id}" class="flex items-center cursor-pointer">
                  <div class="relative">
                    <div class="block bg-gray-600 w-6 h-3 xs:w-9 xs:h-4 rounded-full transition-colors duration-200"></div>
                    <div class="dot absolute left-0 top-0 bg-white w-3 h-3 xs:w-4 xs:h-4 rounded-full transition-transform duration-300"></div>
                  </div>
                </label>
              </div>
            </div>
        </div>
        <div id="expressionSection${id}" class="relative z-10 hidden">
          <div class="relative">
            <div
              class="flex items-center bg-[#000814] border border-gray-600 rounded-md overflow-hidden border border-gray-500"
            >
              <div
                class="px-2 py-1.5 xs:px-2 xs:py-1.5 bg-gray-600 border-r border-gray-500 italic text-gray-300 text-xs xs:text-sm"
              >
                fx
              </div>
              <input
                type="text"
                id="expressionInput${id}"
                class="flex-1 px-2 py-1 xs:px-2 xs:py-1 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-inset text-sm xs:text-base"
                placeholder="Enter expression..."
              />
              <button
                class="px-2 py-1 xs:px-3 xs:py-1 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <svg
                  class="w-3 h-3 xs:w-4 xs:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              id="expressionDropdown${id}"
              class="absolute top-full left-0 right-0 mt-1 bg-[#000814] border border-gray-600 rounded-md shadow-lg z-10"
            >
              <div class="p-3 xs:p-4">
                <div
                  class="flex items-center justify-between mb-2 xs:mb-3"
                >
                  <div
                    class="text-white text-xs xs:text-sm font-medium"
                  >
                    Result
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-400 text-xs xs:text-sm"
                      >Item</span
                    >
                    <span
                      class="bg-gray-600 text-white text-xs px-2 py-1 rounded"
                      >0</span
                    >
                  </div>
                </div>
                <div class="mb-2 xs:mb-3">
                  <div
                    id="expressionResult2"
                    class="text-gray-300 text-xs xs:text-sm"
                  >
                    [Execute previous nodes for preview]
                  </div>
                </div>
                <div
                  class="border-t border-gray-600 pt-2 xs:pt-3"
                >
                  <div class="text-gray-400 text-xs">
                    <span class="font-medium">Tip:</span> Execute
                    previous nodes to use input data
                  </div>
                </div>
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


function initializeRetrySettingsToggle() {
  const toggle = document.getElementById("retrySettingsToggle");
  const content = document.getElementById("retrySettingsContent");
  if (!toggle || !content) return;

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      content.classList.remove("hidden");
    } else {
      content.classList.add("hidden");
    }
  });
}

// Call this after DOM is ready
initializeRetrySettingsToggle();