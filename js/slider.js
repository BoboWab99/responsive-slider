/* Responsive slider with page indicators & control buttons */
/* Github: BoboWab99 */
/* Jan 2023 */


['DOMContentLoaded', 'resize'].forEach(s => {
   window.addEventListener(s, () => {
      _initSliders()
   })
})

/**
 * Slides to element at {itemIndex} in the slider
 * @param {HTMLElement} sliderWrapper slider wrapper element
 * @param {Number} itemIndex slider item index
 */
function _slideTo(sliderWrapper, itemIndex) {
   const { slBtn, srBtn, indicators, slider, itemCount, vItemCount } = sliderEls(sliderWrapper)

   Array.from(slider.querySelectorAll('.slider-item'))[itemIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start'
   })

   // update buttons
   const firstIndex = 0
   const lastIndex = itemCount - 1
   const middle = itemIndex
   const right = middle + vItemCount
   const left = middle - vItemCount

   if (left < firstIndex) {
      slBtn.disabled = true
   } else {
      slBtn.disabled = false
   }
   if (lastIndex < right) {
      srBtn.disabled = true
   } else {
      srBtn.disabled = false
   }

   slBtn.setAttribute('onclick', `_slideTo(this.closest('.slider-wrapper'), ${left})`)
   srBtn.setAttribute('onclick', `_slideTo(this.closest('.slider-wrapper'), ${right})`)

   // update active indicator
   const indicatorIndex = Math.floor(itemIndex / vItemCount)
   const targetIndicator = Array.from(indicators.children)[indicatorIndex]
   if (!targetIndicator.classList.contains('active')) {
      indicators.querySelector('.active').classList.remove('active')
      targetIndicator.classList.add('active')
   }
}

/**
 * Initializes/resets a slider
 * @param {HTMLElement} sliderWrapper slider wrapper element
 */
function _initSlider(sliderWrapper) {
   const { slBtn, srBtn, indicators, link, slider, itemCount, vItemCount } = sliderEls(sliderWrapper)

   // scroll to start
   slider.scrollLeft = 0

   // refresh indicators
   indicators.innerHTML = ''

   if (itemCount > vItemCount) {
      const numIndicators = Math.ceil(itemCount / vItemCount)      
      for (let i = 0; i < numIndicators; i++) {
         indicators.innerHTML += `<li role="button" aria-label="Slider page ${i + 1}" onclick="_slideTo(this.closest('.slider-wrapper'), ${i * vItemCount})"></li>`
      }
      indicators.firstElementChild.classList.add('active')
   }

   // control buttons
   slBtn.setAttribute('onclick', `_slideTo(this.closest('.slider-wrapper'), ${-1 * vItemCount})`)
   srBtn.setAttribute('onclick', `_slideTo(this.closest('.slider-wrapper'), ${vItemCount})`)

   // disable buttons
   slBtn.disabled = true
   srBtn.disabled = false
   link.classList.remove('disabled')

   if (vItemCount >= itemCount) {
      srBtn.disabled = true
      link.classList.add('disabled')
   }
}

/**
 * @param {HTMLElement} sliderWrapper 
 * @returns 
 */
function sliderEls(sliderWrapper) {
   return {
      slBtn: sliderWrapper.querySelector('.btn-slide-left'),
      srBtn: sliderWrapper.querySelector('.btn-slide-right'),
      indicators: sliderWrapper.querySelector('.slider-indicators'),
      link: sliderWrapper.querySelector('.slider-link'),
      slider: sliderWrapper.querySelector('.slider'),
      itemCount: sliderWrapper.querySelectorAll('.slider-item').length,
      vItemCount: Number(getComputedStyle(sliderWrapper).getPropertyValue('--visible-items'))
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