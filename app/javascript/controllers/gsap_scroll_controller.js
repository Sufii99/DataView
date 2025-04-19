import { Controller } from "@hotwired/stimulus"
import gsap from "gsap"
import ScrollTrigger from "@gsap/scroll-trigger"

gsap.registerPlugin(ScrollTrigger)

export default class extends Controller {
  connect() {
    const cards = document.querySelectorAll("[data-gsap='card']")
    const heading = document.querySelector("[data-gsap='heading']")

    if (heading) {
      gsap.from(heading, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heading,
          toggleActions: "play reverse play reverse",
        }
      })
    }

    cards.forEach((card, index) => {
      const directions = ["left", "right", "up"]
      const dir = directions[index % directions.length]
      let x = 0, y = 0

      if (dir === "left") x = -50
      if (dir === "right") x = 50
      if (dir === "up") y = 50

      gsap.from(card, {
        x,
        y,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          toggleActions: "play reverse play reverse",
        }
      })
    })
  }
}
