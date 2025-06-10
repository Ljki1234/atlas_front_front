
(function ($) {
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let selectedSuite = null;
    let startDate = null;
    let endDate = null;
    let totalNights = 0;
    let totalPrice = 0;
    let guests = 2;

    // Booking steps navigation
    const steps = document.querySelectorAll('.step');
    const sections = document.querySelectorAll('.booking-section');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');

    // Format date
    function formatDate(date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    // Suite selection
    const suiteCards = document.querySelectorAll('.suite-card');
    suiteCards.forEach(card => {
      card.addEventListener('click', function() {
        // Remove selected class from all cards
        suiteCards.forEach(c => c.classList.remove('selected'));

        // Add selected class to clicked card
        this.classList.add('selected');

        // Store selected suite info
        selectedSuite = {
          id: this.dataset.suiteId,
          name: this.querySelector('.card-title').textContent,
          price: parseFloat(this.dataset.price),
          image: this.querySelector('.suite-image').src,
          amenities: Array.from(this.querySelectorAll('.amenity-badge')).map(badge => badge.textContent)
        };

        // Calculate total price
        totalPrice = selectedSuite.price * totalNights;

        // Update selected suite info section
        document.getElementById('selected-suite-info').style.display = 'block';
        document.getElementById('selected-suite-name').textContent = selectedSuite.name;
        document.getElementById('selected-suite-details').textContent = `${guests} personnes · ${totalNights} nuits`;
        document.getElementById('selected-suite-price').textContent = `${totalPrice}€`;
        document.getElementById('selected-suite-nights').textContent = totalNights;

        // Enable next button
        document.querySelector('.next-step[data-step="2"]').disabled = false;
      });
    });

    // Guest selection
    // document.getElementById('guests').addEventListener('change', function() {
    //   guests = parseInt(this.value);
    //   if (selectedSuite) {
    //     document.getElementById('selected-suite-details').textContent = `${guests} personnes · ${totalNights} nuits`;
    //   }
    // });

    // Next step buttons
    nextButtons.forEach(button => {
      button.addEventListener('click', function() {
        const currentStep = parseInt(this.dataset.step);
        const nextStep = currentStep + 1;

        // Validate current step before proceeding
        if (currentStep === 3) {
          const form = document.getElementById('guest-info-form');
          if (!validateForm(form)) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
          }

          // Update payment summary
          updatePaymentSummary();
        }

        if (currentStep === 4) {
          const paymentForm = document.getElementById('payment-form');
          if (!validateForm(paymentForm)) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
          }

          // Update confirmation details
          updateConfirmationDetails();

          // Show loading animation
          showLoading(function() {
            // Navigate to confirmation page after loading
            navigateToStep(nextStep);
          });

          return;
        }

        // If step 2 (suite selection), update booking summary
        if (currentStep === 2) {
          updateBookingSummary();
        }

        // Navigate to next step
        navigateToStep(nextStep);
      });
    });

    // Previous step buttons
    prevButtons.forEach(button => {
      button.addEventListener('click', function() {
        const currentStep = parseInt(this.dataset.step);
        const prevStep = currentStep - 1;
        navigateToStep(prevStep);
      });
    });

    // Navigate to a specific step
    function navigateToStep(stepNumber) {
      // Update steps UI
      steps.forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');

        if (stepNum < stepNumber) {
          step.classList.add('completed');
        } else if (stepNum === stepNumber) {
          step.classList.add('active');
        }
      });

      // Show the active section
      sections.forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(`step${stepNumber}`).classList.add('active');

      // Scroll to top
      window.scrollTo(0, 0);
    }

    // Update booking summary
    function updateBookingSummary() {
      document.getElementById('summary-checkin').textContent = formatDate(startDate);
      document.getElementById('summary-checkout').textContent = formatDate(endDate);
      document.getElementById('summary-duration').textContent = `${totalNights} nuits`;
      document.getElementById('summary-suite').textContent = selectedSuite.name;
      document.getElementById('summary-guests').textContent = `${guests} personnes`;
      document.getElementById('summary-room-nights').textContent = `${selectedSuite.name} x ${totalNights} nuits`;

      const roomTotal = selectedSuite.price * totalNights;
      const taxAmount = roomTotal * 0.1;
      const finalTotal = roomTotal + taxAmount;

      document.getElementById('summary-room-total').textContent = `${roomTotal}€`;
      document.getElementById('summary-taxes').textContent = `${taxAmount.toFixed(2)}€`;
      document.getElementById('summary-total').textContent = `${finalTotal.toFixed(2)}€`;
    }

    // Update payment summary
    function updatePaymentSummary() {
      document.getElementById('payment-checkin').textContent = formatDate(startDate);
      document.getElementById('payment-checkout').textContent = formatDate(endDate);
      document.getElementById('payment-suite').textContent = selectedSuite.name;
      document.getElementById('payment-room-nights').textContent = `${selectedSuite.name} x ${totalNights} nuits`;

      const roomTotal = selectedSuite.price * totalNights;
      const taxAmount = roomTotal * 0.1;
      let additionalServices = 0;
      let additionalServicesHtml = '';

      // Check additional services
      if (document.getElementById('service-breakfast').checked) {
        const breakfastTotal = 15 * guests * totalNights;
        additionalServices += breakfastTotal;
        additionalServicesHtml += `
            <div class="price-item">
              <span>Petit-déjeuner (${guests} pers. x ${totalNights} jours)</span>
              <span>${breakfastTotal}€</span>
            </div>
          `;
      }

      if (document.getElementById('service-spa').checked) {
        const spaTotal = 25 * guests;
        additionalServices += spaTotal;
        additionalServicesHtml += `
            <div class="price-item">
              <span>Accès au spa (${guests} pers.)</span>
              <span>${spaTotal}€</span>
            </div>
          `;
      }

      if (document.getElementById('service-transfer').checked) {
        const transferTotal = 40;
        additionalServices += transferTotal;
        additionalServicesHtml += `
            <div class="price-item">
              <span>Transfert aéroport</span>
              <span>${transferTotal}€</span>
            </div>
          `;
      }

      // Update additional services section
      document.getElementById('additional-services').innerHTML = additionalServicesHtml;

      const finalTotal = roomTotal + taxAmount + additionalServices;
      const depositAmount = finalTotal * 0.3;

      document.getElementById('payment-room-total').textContent = `${roomTotal}€`;
      document.getElementById('payment-taxes').textContent = `${taxAmount.toFixed(2)}€`;
      document.getElementById('payment-total').textContent = `${finalTotal.toFixed(2)}€`;
      document.getElementById('payment-deposit').textContent = `${depositAmount.toFixed(2)}€`;

      // Handle payment option change
      const payFullOption = document.getElementById('pay-full');
      const payDepositOption = document.getElementById('pay-deposit');
      const depositAmountEl = document.getElementById('deposit-amount');

      payFullOption.addEventListener('change', function() {
        if (this.checked) {
          depositAmountEl.style.display = 'none';
        }
      });

      payDepositOption.addEventListener('change', function() {
        if (this.checked) {
          depositAmountEl.style.display = 'block';
        }
      });
    }

    // Update confirmation details
    function updateConfirmationDetails() {
      const email = document.getElementById('email').value;
      document.getElementById('confirmation-email').textContent = email;
      document.getElementById('confirmation-dates').textContent = `${formatDate(startDate)} - ${formatDate(endDate)} (${totalNights} nuits)`;
      document.getElementById('confirmation-suite').textContent = selectedSuite.name;
      document.getElementById('confirmation-guests').textContent = `${guests} personnes`;

      // Calculate total
      const roomTotal = selectedSuite.price * totalNights;
      const taxAmount = roomTotal * 0.1;
      let additionalServices = 0;

      if (document.getElementById('service-breakfast').checked) {
        additionalServices += 15 * guests * totalNights;
      }

      if (document.getElementById('service-spa').checked) {
        additionalServices += 25 * guests;
      }

      if (document.getElementById('service-transfer').checked) {
        additionalServices += 40;
      }

      const finalTotal = roomTotal + taxAmount + additionalServices;

      // Check if paying deposit only
      if (document.getElementById('pay-deposit').checked) {
        const depositAmount = finalTotal * 0.3;
        document.getElementById('confirmation-total').textContent = `${depositAmount.toFixed(2)}€ (acompte 30%)`;
      } else {
        document.getElementById('confirmation-total').textContent = `${finalTotal.toFixed(2)}€`;
      }

      // Generate random booking number
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      document.getElementById('booking-number').textContent = `AFR-2025-${randomNum}`;
    }

    // Print confirmation
    // document.getElementById('print-confirmation').addEventListener('click', function() {
    //   window.print();
    // });

    // Form validation
    function validateForm(form) {
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;

      requiredFields.forEach(field => {
        if (!field.value) {
          field.classList.add('is-invalid');
          valid = false;
        } else {
          field.classList.remove('is-invalid');
        }
      });

      return valid;
    }

    // Show loading animation
    function showLoading(callback) {
      const loadingOverlay = document.createElement('div');
      loadingOverlay.style.position = 'fixed';
      loadingOverlay.style.top = '0';
      loadingOverlay.style.left = '0';
      loadingOverlay.style.width = '100%';
      loadingOverlay.style.height = '100%';
      loadingOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      loadingOverlay.style.display = 'flex';
      loadingOverlay.style.justifyContent = 'center';
      loadingOverlay.style.alignItems = 'center';
      loadingOverlay.style.zIndex = '9999';

      const loaderWrapper = document.createElement('div');
      loaderWrapper.style.textAlign = 'center';

      const loader = document.createElement('div');
      loader.className = 'loader';

      const message = document.createElement('div');
      message.style.marginTop = '20px';
      message.style.fontWeight = 'bold';
      message.textContent = 'Traitement de votre paiement...';

      loaderWrapper.appendChild(loader);
      loaderWrapper.appendChild(message);
      loadingOverlay.appendChild(loaderWrapper);
      document.body.appendChild(loadingOverlay);

      // Remove loading overlay after 2 seconds
      setTimeout(function() {
        document.body.removeChild(loadingOverlay);
        if (callback) callback();
      }, 2000);
    }

    // Header scroll effect
    window.addEventListener('scroll', function() {
      const header = document.getElementById('header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      }
    });
  });

  // background color when scroll

  var initScrollNav = function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 200) {
      $('.navbar.fixed-top').addClass("bg-black");
    } else {
      $('.navbar.fixed-top').removeClass("bg-black");
    }
  }

  $(window).scroll(function () {
    initScrollNav();
  });

  // init Chocolat light box
  var initChocolat = function () {
    Chocolat(document.querySelectorAll('.image-link'), {
      imageSize: 'contain',
      loop: true,
    })
  }


  "use strict";

  window.addEventListener("load", (event) => {
    //isotope
    $('.isotope-container').isotope({
      // options
      itemSelector: '.item',
      layoutMode: 'masonry',
    });



    // Initialize Isotope
    var $container = $('.isotope-container').isotope({
      // options
      itemSelector: '.item',
      layoutMode: 'masonry',
    });


    //active button
    $('.filter-button').click(function () {
      $('.filter-button').removeClass('active');
      $(this).addClass('active');
    });


    // Filter items on button click
    $('.filter-button').click(function () {
      var filterValue = $(this).attr('data-filter');
      if (filterValue === '*') {
        // Show all items
        $container.isotope({ filter: '*' });
      } else {
        // Show filtered items
        $container.isotope({ filter: filterValue });
      }
    });

  });


  $(document).ready(function () {
    var activityGallerySwiper = new Swiper(".activity-gallery-swiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });




    initChocolat();


    /* Video */
    var $videoSrc;
    $('.play-btn').click(function () {
      $videoSrc = $(this).data("src");
    });
    $('#myModal').on('shown.bs.modal', function (e) {
      $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    })
    $('#myModal').on('hide.bs.modal', function (e) {
      $("#video").attr('src', $videoSrc);
    })

    $(".user-items .search-item").click(function () {
      $(".search-box").toggleClass('active');
      $(".search-box .search-input").focus();
    });
    $(".close-button").click(function () {
      $(".search-box").toggleClass('active');
    });


    // ------------------------------------------------------------------------------ //
    // Swiper
    // ------------------------------------------------------------------------------ //

    var swiper = new Swiper(".product-swiper", {
      slidesPerView: 3,
      spaceBetween: 20,
      navigation: {
        nextEl: ".icon-arrow-right",
        prevEl: ".icon-arrow-left",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        901: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        1280: {
          slidesPerView: 3,
          spaceBetween: 5,
        },
      },
    });

    var swiper = new Swiper(".testimonial-swiper", {
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    // product single page
    var thumb_slider = new Swiper(".product-thumbnail-slider", {
      autoplay: true,
      loop: true,
      spaceBetween: 8,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    var large_slider = new Swiper(".product-large-slider", {
      autoplay: true,
      loop: true,
      spaceBetween: 10,
      effect: 'fade',
      thumbs: {
        swiper: thumb_slider,
      },
    });


    // new DateTimePickerComponent.DatePicker('select-arrival-date');
    // new DateTimePickerComponent.DatePicker('select-departure-date');



  }); // End of a document



})(jQuery);
