<script lang="ts">
	import { PluginStore } from "main";
	import moment from "moment";
	import { MarkdownView, TFile } from "obsidian";
	import type {
		QuickShareData,
		QuickShareDataList,
	} from "src/lib/cache/AbstractCache";
	import CacheStore from "src/lib/stores/CacheStore";
	import IconButton from "src/lib/obsidian-svelte/IconButton.svelte";
	import { onMount } from "svelte";
	import ActiveCacheFile from "src/lib/stores/ActiveCacheFile";

	let data: QuickShareDataList;
	let filteredData: QuickShareDataList;

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

	function isShared(data: QuickShareData) {
		return data && !hasExpired(data) && !deletedFromServer(data);
	}

	function getSubText(
		data: QuickShareData | undefined,
		options?: { long?: boolean }
	) {
		if (!data) {
			return "Not shared";
		}

		if (hasExpired(data)) {
			return options?.long ? "Note has expired from server" : "Expired";
		}

		if (deletedFromServer(data)) {
			return options?.long ? "Removed from server" : "Unshared";
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

	function onShare(file: TFile) {
		$PluginStore.shareNote(file);
	}

	$: data = $CacheStore;
	$: filteredData = data?.filter(
		(d) => !deletedFromServer(d) && !(deletedFromVault(d) && hasExpired(d))
	);

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
	{#if $ActiveCacheFile?.file}
		<div id="current-file">
			<div class="content-left">
				<div
					class="share-info {!isShared($ActiveCacheFile?.cache) &&
						'share-info--not-shared'}"
				>
					<div class="share-info-top">
						{getSubText(data && $ActiveCacheFile?.cache, {
							long: true,
						})}
					</div>
					{#if isShared($ActiveCacheFile?.cache) && $ActiveCacheFile?.cache?.view_url}
						<a
							class="share-info-sub"
							href={$ActiveCacheFile?.cache?.view_url}
							target="_blank"
						>
							{$ActiveCacheFile?.cache.view_url}</a
						>
					{/if}
				</div>
			</div>
			<div class="content-right">
				{#if !$ActiveCacheFile?.cache || !isShared($ActiveCacheFile?.cache)}
					<button on:click={() => onShare($ActiveCacheFile.file)}
						>Share</button
					>
				{:else}
					<div class="item-actions">
						<IconButton
							icon="reset"
							size="xs"
							on:click={() => onShare($ActiveCacheFile.file)}
							tooltip="Share again"
						/>
						<IconButton
							icon="trash"
							size="xs"
							on:click={() =>
								onUnshare($ActiveCacheFile?.cache.fileId)}
							tooltip="Remove access"
						/>
					</div>
				{/if}
			</div>
		</div>

		<hr class="divider" />
	{/if}

	<div id="history">
		<div class="history-header">Recently shared</div>
		<div class="history-list">
			{#each filteredData as item}
				<!-- svelte-ignore a11y-unknown-aria-attribute -->
				<div
					aria-label={!deletedFromVault(item)
						? `Click to open note`
						: undefined}
					aria-label-position="left"
					class="history-item 
					{hasExpired(item) && 'history-item--expired'}
					{deletedFromServer(item) && 'history-item--deleted-server'}
					{deletedFromVault(item) && 'history-item--deleted-vault'}"
				>
					<div class="item-row">
						<div
							class="item-description"
							on:click={() =>
								!deletedFromVault(item) &&
								onOpenNote(item.fileId)}
						>
							<div class="item-name">
								{item.basename}
								{#if deletedFromVault(item)}
									<span class="deleted-text">
										(Deleted from vault)
									</span>
								{/if}
							</div>
							<div class="item-sub">
								{getSubText(item)}
							</div>
						</div>

						{#if !hasExpired(item) && !deletedFromServer(item)}
							<div class="item-actions">
								<IconButton
									icon="open-elsewhere-glyph"
									size="xs"
									on:click={() => onOpen(item.view_url)}
									tooltip="Open in browser"
								/>
								<IconButton
									icon="trash"
									size="xs"
									on:click={() => onUnshare(item.fileId)}
									tooltip="Remove access"
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
	#current-file {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 4px 8px;
		column-gap: 8px;
		font-size: var(--nav-item-size);

		.content-left {
			flex: 1;
			min-width: 0;
		}

		.share-info {
			display: flex;
			flex-direction: column;

			&--not-shared {
				color: var(--text-faint);
			}

			.share-info-sub {
				color: var(--text-faint);
				font-size: 85%;
				word-break: break-all;
				// should only be one line, use ellipsis if it overflows
				display: inline-block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				vertical-align: top;
			}
		}
	}

	.divider {
		border-width: 1px;
		margin: 12px 0px 24px;
	}
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
				}

				.item-name {
					line-height: var(--line-height-tight);
				}

				.item-sub {
					font-size: 85%;
					color: var(--text-faint);
				}

				.item-deleted-vault {
					font-size: 85%;
					color: var(--text-error);
					margin-top: 4px;
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

				&--deleted-vault {
					.item-name {
						color: var(--text-error);
					}
				}
			}
		}
	}

	.item-actions {
		margin-left: 4px;
		display: flex;
		align-items: center;
		column-gap: 2px;
	}
</style>
