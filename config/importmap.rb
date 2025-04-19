# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "chartkick", to: "chartkick.js"
pin "Chart.bundle", to: "Chart.bundle.js"
pin "gsap", to: "https://ga.jspm.io/npm:gsap@3.12.5/index.js"
pin "@gsap/scroll-trigger", to: "https://ga.jspm.io/npm:gsap@3.12.5/ScrollTrigger.js"
