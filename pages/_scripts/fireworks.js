// Shoot a fireworks whenever user clicks or touches the screen

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

canvas.style.position = 'fixed'
canvas.style.top = '0'
canvas.style.left = '0'
canvas.style.width = '100%'
canvas.style.height = '100%'
canvas.style.pointerEvents = 'none'
canvas.style.zIndex = '9999'
document.body.appendChild(canvas)

let width, height
function resize() {
	width = canvas.width = window.innerWidth
	height = canvas.height = window.innerHeight
}
window.addEventListener('resize', resize)
resize()

const particles = []
const rockets = []

class Rocket {
	constructor(startX, startY, targetX, targetY, color) {
		this.x = startX
		this.y = startY
		this.targetX = targetX
		this.targetY = targetY
		this.color = color
		this.exploded = false
		this.reachedPeak = false
		this.peakDelay = 40
		this.alpha = 1.0
		
		const heightDiff = startY - targetY
		this.gravity = 0.12
		// Calculate initial velocity to peak at targetY
		this.vy = -Math.sqrt(2 * this.gravity * heightDiff)
		this.vx = (targetX - startX) / (Math.abs(this.vy) / this.gravity)
		
		this.startVy = this.vy
		this.history = []
	}

	update() {
		this.history.push({ x: this.x, y: this.y })
		if (this.history.length > 8) this.history.shift()

		if (!this.reachedPeak) {
			this.x += this.vx
			this.y += this.vy
			this.vy += this.gravity

			// Gradually fade out to completely transparent at the peak
			this.alpha = Math.max(0, (this.vy / this.startVy))

			if (this.vy >= 0) {
				this.reachedPeak = true
				this.vy = 0
				this.vx = 0
				this.alpha = 0
			}
		} else {
			this.peakDelay--
			this.alpha = 0
			if (this.peakDelay <= 0) {
				this.explode()
			}
		}
	}

	explode() {
		this.exploded = true
		const count = 180 + Math.floor(Math.random() * 60)
		for (let i = 0; i < count; i++) {
			particles.push(new Particle(this.x, this.y, this.color))
		}
	}

	draw() {
		if (this.alpha <= 0 && this.history.length === 0) return

		ctx.save()
		ctx.globalAlpha = this.alpha
		
		ctx.beginPath()
		ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
		ctx.fillStyle = this.color
		ctx.fill()
		
		if (this.history.length > 1) {
			ctx.beginPath()
			ctx.moveTo(this.x, this.y)
			for (let i = this.history.length - 1; i >= 0; i--) {
				ctx.lineTo(this.history[i].x, this.history[i].y)
			}
			ctx.strokeStyle = this.color
			ctx.lineWidth = 2
			ctx.stroke()
		}
		ctx.restore()
	}
}

class Particle {
	constructor(x, y, color) {
		this.x = x
		this.y = y
		this.color = color
		this.angle = Math.random() * Math.PI * 2
		this.speed = Math.random() * 10 + 3 
		this.vx = Math.cos(this.angle) * this.speed
		this.vy = Math.sin(this.angle) * this.speed
		this.friction = 0.98 // Reduced friction (higher value) for further travel
		this.gravity = 0.045
		this.alpha = 1
		this.decay = Math.random() * 0.006 + 0.003 // Slower fade out
		
		this.history = []
		this.maxHistory = 15
	}

	update() {
		this.history.push({ x: this.x, y: this.y })
		if (this.history.length > this.maxHistory) this.history.shift()

		this.vx *= this.friction
		this.vy *= this.friction
		this.vy += this.gravity
		this.x += this.vx
		this.y += this.vy
		this.alpha -= this.decay
	}

	draw() {
		if (this.history.length < 2) return

		ctx.save()
		ctx.globalAlpha = Math.max(0, this.alpha)
		ctx.beginPath()
		ctx.moveTo(this.x, this.y)
		for (let i = this.history.length - 1; i >= 0; i--) {
			ctx.lineTo(this.history[i].x, this.history[i].y)
		}
		ctx.strokeStyle = this.color
		ctx.lineWidth = 1.5
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round'
		ctx.stroke()
		ctx.restore()
	}
}

function launchFirework(x, y) {
	const colors = ['#ff3333', '#33ff33', '#3333ff', '#ffff33', '#ff33ff', '#33ffff', '#ffffff']
	const color = colors[Math.floor(Math.random() * colors.length)]
	rockets.push(new Rocket(x, height, x, y, color))
}

function loop() {
	ctx.clearRect(0, 0, width, height)

	for (let i = rockets.length - 1; i >= 0; i--) {
		const r = rockets[i]
		r.update()
		if (r.exploded) {
			rockets.splice(i, 1)
		} else {
			r.draw()
		}
	}

	for (let i = particles.length - 1; i >= 0; i--) {
		const p = particles[i]
		p.update()
		if (p.alpha <= 0 && p.history.length === 0) {
			particles.splice(i, 1)
		} else {
			if (p.alpha <= 0) p.history.shift() 
			p.draw()
		}
	}
	requestAnimationFrame(loop)
}

loop()

window.addEventListener('pointerdown', (e) => {
	launchFirework(e.clientX, e.clientY)
})