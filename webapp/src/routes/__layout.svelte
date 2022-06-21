<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';

	import '../app.css';
</script>

<div class="container mx-auto max-w-2xl mx-auto mt-6 px-4">
	<slot />
	<Footer />
</div>
