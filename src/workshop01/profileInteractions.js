export default {
  data: () => ({
    pointer: { x: 0, y: 0 },
    progress: 0,
    ready: false,
    touch: false,
    ticking: false,
    cursor: { x: -100, y: -100 },
    ring: { x: -100, y: -100 },
    cursorActive: false,
    cursorHover: false,
    observer: null,
    cleanups: [],
  }),
  computed: {
    parallax() {
      const x = this.pointer.x
      const y = this.pointer.y
      return {
        copy: { transform: `translate3d(${x * -4}px, ${y * -3}px, 0)` },
        art: { transform: `translate3d(${x * 9}px, ${y * 8}px, 0)` },
      }
    },
  },
  mounted() {
    this.touch = window.matchMedia('(hover: none)').matches

    window.addEventListener('pointermove', this.onPointer, { passive: true })
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onScroll, { passive: true })
    window.addEventListener('pointerdown', this.onDown)
    window.addEventListener('pointerup', this.onUp)

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            this.observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    this.$nextTick(() => {
      this.observeReveals()
      this.setupInteractions()
      this.onScroll()
      requestAnimationFrame(() => {
        this.ready = true
      })
    })
  },
  beforeDestroy() {
    window.removeEventListener('pointermove', this.onPointer)
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onScroll)
    window.removeEventListener('pointerdown', this.onDown)
    window.removeEventListener('pointerup', this.onUp)
    if (this.observer) this.observer.disconnect()
    this.cleanups.forEach((fn) => fn())
    this.cleanups = []
  },
  methods: {
    observeReveals() {
      this.$el.querySelectorAll('.reveal').forEach((node) => this.observer.observe(node))
    },

    onScroll() {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      this.progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    },

    onPointer(event) {
      if (event.pointerType === 'touch') return

      const rect = this.$el.getBoundingClientRect()
      const nx = (event.clientX - rect.left) / rect.width - 0.5
      const ny = (event.clientY - rect.top) / rect.height - 0.5

      this.cursor = { x: event.clientX, y: event.clientY }
      this.cursorActive = true
      this.ring = { x: event.clientX, y: event.clientY }

      const target = event.target.closest
        ? event.target.closest('[data-hover], [data-magnetic], .tilt-3d')
        : null
      this.cursorHover = Boolean(target)

      if (this.ticking) return
      this.ticking = true
      requestAnimationFrame(() => {
        this.pointer = {
          x: Math.max(-0.5, Math.min(0.5, nx)),
          y: Math.max(-0.5, Math.min(0.5, ny)),
        }
        this.ticking = false
      })
    },

    onDown() {
      this.cursorActive = true
      this.$el.classList.add('is-press')
    },

    onUp() {
      this.$el.classList.remove('is-press')
    },

    setupInteractions() {
      this.$el.querySelectorAll('.tilt-3d').forEach((el) => {
        const move = (event) => {
          const r = el.getBoundingClientRect()
          const px = (event.clientX - r.left) / r.width
          const py = (event.clientY - r.top) / r.height
          el.style.setProperty('--rx', `${(0.5 - py) * 13}deg`)
          el.style.setProperty('--ry', `${(px - 0.5) * 15}deg`)
          el.style.setProperty('--sx', `${px * 100}%`)
          el.style.setProperty('--sy', `${py * 100}%`)
        }
        const leave = () => {
          el.style.setProperty('--rx', '0deg')
          el.style.setProperty('--ry', '0deg')
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        this.cleanups.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        })
      })

      this.$el.querySelectorAll('[data-magnetic]').forEach((el) => {
        const move = (event) => {
          const r = el.getBoundingClientRect()
          const mx = (event.clientX - (r.left + r.width / 2)) / r.width
          const my = (event.clientY - (r.top + r.height / 2)) / r.height
          el.style.transform = `translate3d(${mx * 14}px, ${my * 12}px, 0)`
        }
        const leave = () => {
          el.style.transform = 'translate3d(0, 0, 0)'
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        this.cleanups.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        })
      })
    },
  },
}
