/* Responsive slider with page indicators & control buttons */
/* Github: BoboWab99 */
/* Jan 2023 */

// initialize
_initSliders()

window.addEventListener('resize', () => {
   _initSliders()
})

/**
 * Slides to element at {itemIndex} in the slider
 * @param {HTMLElement} sliderWrapper slider wrapper element
 * @param {Number} itemIndex slider item index
 */
function _slideTo(sliderWrapper, itemIndex) {
   const slideLeftBtn = sliderWrapper.querySelector('.btn-slide-left')
   const slideRightBtn = sliderWrapper.querySelector('.btn-slide-right')
   const sliderIndicators = sliderWrapper.querySelector('.slider-indicators')
   const slider = sliderWrapper.querySelector('.slider')
   const totalVisible = _visibleItemsCount(sliderWrapper)

   Array.from(slider.children)[itemIndex].scrollIntoView({
      inline: 'start'
   })

   // update buttons
   const firstIndex = 0
   const lastIndex = slider.childElementCount - 1
   const middle = itemIndex
   const right = middle + totalVisible
   const left = middle - totalVisible

   if (left < firstIndex) {
      slideLeftBtn.disabled = true
   } else {
      slideLeftBtn.disabled = false
   }
   if (lastIndex < right) {
      slideRightBtn.disabled = true
   } else {
      slideRightBtn.disabled = false
   }
   slideLeftBtn.setAttribute('onclick', `_slideTo(this.closest('.slider-wrapper'), ${left})`)
   slideRightBtn.setAttribute('onclick', `_slideTo(this.closest('.slider-wrapper'), ${right})`)

   // update active indicator
   const indicatorIndex = Math.floor(itemIndex / totalVisible)
   const targetIndicator = Array.from(sliderIndicators.children)[indicatorIndex]
   if (!targetIndicator.classList.contains('active')) {
      sliderIndicators.querySelector('.active').classList.remove('active')
      targetIndicator.classList.add('active')
   }
}

/**
 * Reads number of visible items from css
 * @param {HTMLElement} sliderWrapper slider wrapper element
 * @returns number of visible elements in the slider
 */
function _visibleItemsCount(sliderWrapper) {
   return Number(getComputedStyle(sliderWrapper).getPropertyValue('--visible-items'))
}

/**
 * Initializes/resets a slider
 * @param {HTMLElement} sliderWrapper slider wrapper element
 */
function _initSlider(sliderWrapper) {
   const slideLeftBtn = sliderWrapper.querySelector('.btn-slide-left')
   const slideRightBtn = sliderWrapper.querySelector('.btn-slide-right')
   const sliderIndicators = sliderWrapper.querySelector('.slider-indicators')
   const sliderLink = sliderWrapper.querySelector('.slider-link')
   const slider = sliderWrapper.querySelector('.slider')
   const totalVisible = _visibleItemsCount(sliderWrapper)

   // scroll to start
   slider.scrollLeft = 0

   // refresh indicators
   if (slider.childElementCount > totalVisible) {
      const numIndicators = Math.ceil(slider.childElementCount / totalVisible)
      sliderIndicators.innerHTML = ''
      for (let i = 0; i < numIndicators; i++) {
         sliderIndicators.innerHTML += `<li role="button" onclick="_slideTo(this.closest('.slider-wrapper'), ${i * totalVisible})"></li>`
      }
      sliderIndicators.firstElementChild.classList.add('active')
   }

   // control buttons
   slideLeftBtn.setAttribute('onclick', `_slideTo(this.closest('.slider-wrapper'), ${-1 * totalVisible})`)
   slideRightBtn.setAttribute('onclick', `_slideTo(this.closest('.slider-wrapper'), ${totalVisible})`)

   // disable buttons
   slideLeftBtn.disabled = true
   slideRightBtn.disabled = false
   sliderLink.disabled = false
   if (totalVisible > slider.childElementCount) {
      slideRightBtn.disabled = true
      sliderLink.disabled = true
   }
}

/**
 * Initializes/resets all sliders in a page
 */
function _initSliders() {
   document.querySelectorAll('.slider-wrapper').forEach(wrapper => {
      _initSlider(wrapper)
   })
}