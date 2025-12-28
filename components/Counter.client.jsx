import './Counter.css'
import { signal } from 'refui'

export default function Counter({ initial = 0 }) {
	const count = signal(initial)
	return (
		<div class="counter">
			<button on:click={() => count.value--}>-</button>
			<span>{count}</span>
			<button on:click={() => count.value++}>+</button>
		</div>
	)
}
