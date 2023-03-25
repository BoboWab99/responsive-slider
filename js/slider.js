/* Responsive slider with page indicators & control buttons */
/* Github: BoboWab99 */
/* Jan 2023 */


window.addEventListener('DOMContentLoaded', () => {
   _initSliders(true)
})

window.addEventListener('resize', () => {
   _initSliders(false)
})

/**
 * Slides to element at {itemIndex} in the slider
 * @param {HTMLElement} sliderWrapper slider wrapper element
 * @param {Number} itemIndex slider item index
 */
function _slideTo(sliderWrapper, itemIndex) {
   const { slBtn, srBtn, indicators, slider, itemCount, vItemCount } = sliderEls(sliderWrapper)
   const lastScrollTo = vItemCount * (Math.ceil(itemCount / vItemCount) - 1)
   let index = itemIndex
   let behavior = 'instant'

   if (index < 0) index = lastScrollTo
   else if (index > lastScrollTo) index = 0
   else behavior = 'smooth'

   Array.from(slider.querySelectorAll('.slider-item'))[index].scrollIntoView({
      behavior: behavior,
      block: 'nearest',
      inline: 'start'
   })

   const next = index + vItemCount
   const prev = index - vItemCount

   slBtn.setAttribute('onclick', `_slideTo(this.closest('.slider-wrapper'), ${prev})`)
   srBtn.setAttribute('onclick', `_slideTo(this.closest('.slider-wrapper'), ${next})`)

   // update active indicator
   const indicatorIndex = Math.floor(index / vItemCount)
   const targetIndicator = Array.from(indicators.children)[indicatorIndex]
   indicators.querySelector('.active').classList.remove('active')
   targetIndicator.classList.add('active')
}

/**
 * Initializes/resets a slider
 * @param {HTMLElement} sliderWrapper slider wrapper element
 * @param {Boolean} onload is window loading?
 */
async function _initSlider(sliderWrapper, onload) {
   const { slBtn, srBtn, indicators, link, slider, itemCount, vItemCount } = sliderEls(sliderWrapper)

   const __init__ = async () => {
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

      // refresh cta buttons
      slBtn.disabled = false
      srBtn.disabled = false
      link.classList.remove('disabled')

      if (vItemCount >= itemCount) {
         slBtn.disabled = true
         srBtn.disabled = true
         link.classList.add('disabled')
      }
   }

   await __init__()

   if (onload && sliderWrapper.getAttribute('data-autoslide') == 'true') {
      autoslide(sliderWrapper)
   }
}

/**
 * @param {HTMLElement} sliderWrapper 
 * @param {Number} interval 
 */
async function autoslide(sliderWrapper, interval = 5000) {
   const { srBtn } = sliderEls(sliderWrapper)
   const run = () => {
      console.log('run...')
      srBtn.click()
      setTimeout(run, interval)
   }
   setTimeout(() => {
      run()
   }, (interval + 1000))
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
 * @param {Boolean} onload is window loading?
 */
function _initSliders(onload) {
   document.querySelectorAll('.slider-wrapper').forEach(wrapper => {
      _initSlider(wrapper, onload)
   })
}