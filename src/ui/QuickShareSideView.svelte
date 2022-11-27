<script lang="ts">
	import { PluginStore } from "main";
	import moment from "moment";
	import { MarkdownView } from "obsidian";
	import type {
		QuickShareData,
		QuickShareDataList,
	} from "src/lib/cache/AbstractCache";
	import CacheStore from "src/lib/cache/CacheStore";
	import IconButton from "src/lib/obsidian-svelte/IconButton.svelte";
	import { onMount } from "svelte";

	let data: QuickShareDataList;

	$: data = $CacheStore;

	function hasExpired(data: QuickShareData) {
		const expiration = moment(data.expire_datetime);
		return moment().isAfter(expiration);
	}

	function deletedFromVault(data: QuickShareData) {
		return data.deleted_from_vault;
	}

	function deletedFromServer(data: QuickShareData) {
		return data.deleted_from_server;
	}

	function getSubText(data: QuickShareData) {
		if (hasExpired(data)) {
			return "Expired";
		}

		if (deletedFromServer(data)) {
			return "Unshared";
		}

		const timeString = moment(data.updated_datetime ?? data.shared_datetime)
			.locale("en-US")
			.fromNow(true);

		return data.updated_datetime
			? `Updated ${timeString} ago`
			: `Shared ${timeString} ago`;
	}

	function onOpenNote(fileId: string) {
		let leafFound = false;
		$PluginStore.app.workspace.iterateRootLeaves((leaf) => {
			if (leaf.view instanceof MarkdownView) {
				const view = leaf.view as MarkdownView;
				if (view.file.path === fileId) {
					$PluginStore.app.workspace.setActiveLeaf(leaf);
					leafFound = true;
				}
			}
		});
		if (leafFound) {
			return;
		}

		$PluginStore.app.workspace.openLinkText(fileId, fileId, true);
	}

	function onOpen(url: string) {
		window.open(url, "_blank");
	}

	function onUnshare(fileId: string) {
		$PluginStore.deleteNote(fileId);
	}

	onMount(() => {
		// Force a rerender every 30 seconds to update rendered timestamps
		const timer = window.setInterval(() => {
			data = [...$CacheStore];
		}, 30_000);
		$PluginStore.registerInterval(timer);
		return () => {
			clearInterval(timer);
		};
	});
</script>

<div id="quickshare-pane">
	<div id="history">
		<div class="history-header">Recently shared</div>
		<div class="history-list">
			{#each data as item}
				<div
					class="history-item 
					{hasExpired(item) && 'history-item--expired'}
					{deletedFromServer(item) && 'history-item--deleted-server'}"
				>
					<div class="item-row">
						<div
							class="item-description"
							on:click={() => onOpenNote(item.fileId)}
						>
							<div class="item-name">{item.basename}</div>
							<div class="item-sub">
								{getSubText(item)}
							</div>
						</div>

						{#if !hasExpired(item) && !deletedFromServer(item)}
							<div class="item-actions">
								<IconButton
									icon="link"
									size="xs"
									on:click={() => onOpen(item.view_url)}
								/>
								<IconButton
									icon="trash"
									size="xs"
									disabled
									on:click={() => onUnshare(item.fileId)}
								/>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	#history {
		font-weight: var(--nav-item-weight);
		font-size: var(--nav-item-size);

		.history-header {
			color: var(--text-normal);
			padding: 4px 8px;
			font-weight: var(--font-medium);
		}

		.history-list {
			padding: 4px 1px 16px;
			.history-item {
				padding: 4px 8px;
				border-radius: var(--radius-s);
				color: var(--nav-item-color);

				.item-row {
					display: flex;
					justify-content: space-between;
					align-items: flex-start;

					.item-description {
						flex: 1;
					}

					.item-actions {
						margin-left: 4px;
						display: flex;
						align-items: center;
						column-gap: 2px;
					}
				}

				.item-name {
					line-height: var(--line-height-tight);
				}

				.item-sub {
					font-size: 85%;
					color: var(--text-faint);
				}

				&:hover {
					background-color: var(--nav-item-background-hover);
					font-weight: var(--nav-item-weight-hover);
					color: var(--nav-item-color-hover);
				}

				&--expired {
					.item-name {
						color: var(--text-faint);
					}
				}

				&--deleted-server {
					.item-name {
						color: var(--text-faint);
					}
				}
			}
		}
	}
</style>
