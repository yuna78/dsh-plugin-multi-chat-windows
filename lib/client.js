window.__ModuleLoader__.load({
	id: "dsh-plugin-multi-chat-windows",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react_dom = null;
		try {
			react_dom = require("react-dom");
		} catch (error) {
			console.warn("[multi-chat-windows] react-dom unavailable:", error);
		}
		const { Fragment, useState, useEffect, useRef, useCallback, useSyncExternalStore, createContext, useContext } = react;
		const jsx = react_jsx_runtime.jsx;
		const jsxs = react_jsx_runtime.jsxs;
		//#region lib/client/style.js
		const css = ".mcw-win{position:fixed;display:flex;flex-direction:column;border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-base);box-shadow:var(--dsw-elevation-panel);border:.5px solid var(--dsw-alias-border-l2);overflow:hidden;z-index:40;min-width:360px;min-height:280px}.mcw-win[data-dragging]{z-index:60;opacity:.94;transition:none}.mcw-head{align-items:center;gap:6px;height:36px;flex:none;background:var(--dsw-specific-menu);border-bottom:.5px solid var(--dsw-alias-border-l3);padding:0 6px 0 12px;display:flex;cursor:grab;user-select:none;touch-action:none}.mcw-head[data-dragging]{cursor:grabbing}.mcw-title{color:var(--dsw-alias-label-primary);font-size:12.5px;font-weight:500;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;pointer-events:none}.mcw-headSlot{display:flex;align-items:center;min-width:0;max-width:60%;flex:none}.mcw-snapDot{flex:none;width:7px;height:7px;border-radius:999px;background:var(--dsw-alias-border-l3)}.mcw-snapDot[data-on]{background:var(--dsw-alias-state-business-primary)}.mcw-dockDot{width:9px;height:9px;margin:0 2px}.mcw-dockDot[data-idle]{background:var(--dsw-alias-border-l3);opacity:.7}.mcw-dockDot[data-done]{background:var(--dsw-alias-state-success-primary,var(--dsw-alias-state-business-primary))}.mcw-dockDot[data-attention]{background:var(--dsw-alias-state-warning-primary,var(--dsw-alias-state-business-primary))}.mcw-dockDot[data-running]{background:transparent;border:1.6px solid var(--dsw-alias-state-business-primary);border-top-color:transparent;animation:mcw-spin .8s linear infinite}@keyframes mcw-spin{to{transform:rotate(1turn)}}.mcw-btn{corner-shape:round;width:26px;height:26px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:999px;flex:none;place-items:center;padding:0;display:grid;font-size:11px}.mcw-btn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.mcw-btn[data-on]{color:var(--dsw-alias-state-business-primary)}.mcw-body{flex:1;min-height:0;display:flex;flex-direction:column;position:relative;overflow:hidden}.mcw-body[data-dragging]>*{pointer-events:none}.mcw-win[data-mcw-zone=left]{cursor:ew-resize}.mcw-win[data-mcw-zone=bottom]{cursor:ns-resize}.mcw-win[data-mcw-zone=corner]{cursor:nwse-resize}.mcw-win[data-mcw-zone] *{cursor:inherit}.mcw-dock{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);display:flex;align-items:center;gap:6px;max-width:70vw;padding:4px;border-radius:999px;background:var(--dsw-specific-menu);border:.5px solid var(--dsw-alias-border-l3);box-shadow:var(--dsw-elevation-panel);z-index:50}.mcw-dockChip{display:flex;align-items:center;height:28px;padding-left:10px;border-radius:999px;background:var(--dsw-alias-bg-base);border:.5px solid var(--dsw-alias-border-l2);cursor:pointer;max-width:230px;color:var(--dsw-alias-label-primary)}.mcw-dockChip:hover{background:var(--dsw-alias-interactive-bg-hover)}.mcw-dockLabel{font-size:12px;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:170px;user-select:none}.mcw-fallback{color:var(--dsw-alias-label-tertiary);font-size:12px;margin:auto;padding:16px;text-align:center}";
		const tagId = "dsh-plugin-multi-chat-windows/shell.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=\"" + tagId + "\"]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin-multi-chat-windows";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region lib/client/locales.js
		/**
		 * Popout support probe: Electron shells (and other WebViews) deny window.open,
		 * so the popout affordances only render in a real browser engine.
		 */
		const canPopout = (() => {
			const ua = typeof navigator !== "undefined" ? String(navigator.userAgent) : "";
			return /Chrome\/|Edg\//.test(ua) && !/Electron\//.test(ua);
		})();
		const NS = "multiChatWindows";
		const zh = {
			"window.open": "在并列窗口打开",
			"window.close": "关闭并列窗口",
			"window.openAria": "在并列窗口中打开该会话",
			"window.closeAria": "关闭该会话的并列窗口",
			"win.snap": "吸附到主对话旁边",
			"win.snapOn": "已吸附（跟随主对话布局）",
			"win.tile": "把所有并列窗口横向平铺",
			"win.minimize": "最小化到底部",
			"win.restore": "还原窗口",
			"win.popout": "弹出为独立浏览器窗口",
			"win.popoutDefault": "默认弹出为独立窗口",
			"win.running": "运行中",
			"win.done": "刚完成（有新消息）",
			"win.attention": "需要你确认",
			"win.idle": "空闲",
			"win.closeAria": "关闭窗口",
			"win.loading": "正在载入会话…"
		};
		const en = {
			"window.open": "Open in split window",
			"window.close": "Close split window",
			"window.openAria": "Open this chat in a split window",
			"window.closeAria": "Close this chat's split window",
			"win.snap": "Snap beside the main chat",
			"win.snapOn": "Snapped (follows the main chat layout)",
			"win.tile": "Tile all split windows side by side",
			"win.minimize": "Minimize to the bottom dock",
			"win.restore": "Restore window",
			"win.popout": "Pop out into a separate browser window",
			"win.popoutDefault": "Pop out by default",
			"win.running": "Running",
			"win.done": "Just finished (new messages)",
			"win.attention": "Needs your confirmation",
			"win.idle": "Idle",
			"win.closeAria": "Close window",
			"win.loading": "Loading session…"
		};
		//#endregion
		//#region lib/client/geometry.js
		/** Anchor point hugging the main conversation's right edge (falls back to the viewport right). */
		function computeAnchor(width) {
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			let x = vw - width - 24;
			let y = 64;
			const conversation = document.querySelector("[data-conversation-scroll]");
			if (conversation !== null) {
				const rect = conversation.getBoundingClientRect();
				x = rect.right + 12;
				y = Math.max(12, rect.top - 44);
			}
			return {
				x: Math.max(8, Math.min(x, Math.max(8, vw - width - 8))),
				y: Math.max(8, Math.min(y, Math.max(8, vh - 180)))
			};
		}
		function clampGeometry(geom) {
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			const width = Math.max(360, Math.min(Math.round(geom.w), Math.max(360, Math.round(vw - 16))));
			const height = Math.max(280, Math.min(Math.round(geom.h), Math.max(280, Math.round(vh - 16))));
			return {
				w: width,
				h: height,
				x: Math.max(8, Math.min(Math.round(geom.x), Math.max(8, vw - width - 8))),
				y: Math.max(8, Math.min(Math.round(geom.y), Math.max(8, vh - height - 8)))
			};
		}
		//#endregion
		//#region lib/client/store.js
		const STORAGE_KEY = "dsh-plugin-multi-chat-windows.v3";
		function readPersisted() {
			try {
				const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
				const parsed = raw === null ? {} : JSON.parse(raw);
				return parsed && typeof parsed === "object" ? parsed : {};
			} catch {
				return {};
			}
		}
		function writePersisted(state) {
			try {
				if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
			} catch {}
		}
		/**
		 * Window registry for one plugin fiber: ordered open sessions with their
		 * geometry plus the retained Session references backing them. Snap=true
		 * keeps a window anchored beside the main conversation; dragging detaches it.
		 */
		function createWindowStore(sessions) {
			const persisted = readPersisted();
			const savedGeometry = persisted.geometry && typeof persisted.geometry === "object" ? persisted.geometry : {};
			const savedOrder = Array.isArray(persisted.order) ? persisted.order.filter((id) => typeof id === "string") : [];
			const savedPopoutDefault = persisted.popoutDefault === true;
			let order = [];
			let popoutDefault = savedPopoutDefault;
			/** Monotonic store revision so useSyncExternalStore subscribers re-render on any change. */
			let ver = 0;
			const geometry = new Map();
			const refs = new Map();
			const listeners = new Set();
			const persist = () => {
				const out = { order, geometry: {}, popoutDefault };
				for (const [id, geom] of geometry) out.geometry[id] = geom;
				writePersisted(out);
			};
			const publish = () => {
				ver++;
				for (const listener of [...listeners]) listener();
			};
			const store = {
				/** Bumped on every mutation; components subscribe to this revision number. */
				getSnapshot: () => ver,
				subscribe(listener) {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				},
				orderSnapshot() {
					return order;
				},
				isOpen(sessionId) {
					return order.includes(sessionId);
				},
				geomOf(sessionId) {
					return geometry.get(sessionId);
				},
				/** Retain (or reuse) the Session reference that backs one window. */
				ensureRef(sessionId) {
					const existing = refs.get(sessionId);
					if (existing !== void 0) return existing;
					try {
						const reference = sessions.retain(sessionId, { source: "multi-chat-windows" });
						reference.ready.catch(() => {});
						refs.set(sessionId, reference);
						return reference;
					} catch (error) {
						console.warn("[multi-chat-windows] retain failed:", error);
						return void 0;
					}
				},
				refOf(sessionId) {
					return refs.get(sessionId);
				},
				geometryFor(sessionId) {
					const existing = geometry.get(sessionId);
					if (existing !== void 0) return existing;
					const saved = savedGeometry[sessionId];
					const width = saved && typeof saved.w === "number" ? saved.w : 560;
					const anchored = saved && typeof saved.x === "number" && typeof saved.y === "number" ? { x: saved.x, y: saved.y } : computeAnchor(width);
					const geom = { ...clampGeometry({ ...anchored, w: width, h: saved && typeof saved.h === "number" ? saved.h : Math.max(320, Math.round(window.innerHeight * .72)) }), snap: !(saved && saved.snap === false), minimized: !!(saved && saved.minimized) };
					geometry.set(sessionId, geom);
					persist();
					return geom;
				},
				setGeometry(sessionId, patch) {
					const current = geometry.get(sessionId);
					if (current === void 0) return;
					geometry.set(sessionId, { ...current, ...patch, snap: patch.snap ?? current.snap, minimized: patch.minimized ?? current.minimized });
					persist();
					publish();
				},
				snap(sessionId) {
					const current = geometry.get(sessionId);
					if (current === void 0) return;
					store.setGeometry(sessionId, { snap: !current.snap, ...(current.snap ? {} : computeAnchor(current.w)) });
				},
				minimize(sessionId) {
					store.setGeometry(sessionId, { minimized: true });
				},
				/** Un-minimize one window (named to avoid clashing with the boot-time restore()). */
				unminimize(sessionId) {
					store.setGeometry(sessionId, { minimized: false });
				},
				/** Lay every visible window out side by side, adjacent, tops aligned. */
				tileAllWindows() {
					const open = order.filter((id) => {
						const geom = geometry.get(id);
						return geom !== void 0 && geom.minimized !== true;
					});
					if (open.length === 0) return;
					const sorted = [...open].sort((a, b) => {
						const left = geometry.get(a), right = geometry.get(b);
						return left.x - right.x || left.y - right.y;
					});
					const vw = window.innerWidth;
					const vh = window.innerHeight;
					const gap = 8;
					const totalWidth = sorted.reduce((sum, id) => sum + geometry.get(id).w, 0) + gap * (sorted.length - 1);
					const anchor = computeAnchor(geometry.get(sorted[0]).w);
					let x = totalWidth <= vw - 16 ? Math.max(8, Math.min(anchor.x, vw - totalWidth - 8)) : Math.max(8, vw - totalWidth - 8);
					const y = Math.max(8, Math.min(anchor.y, vh - 280 - 8));
					const sharedHeight = Math.min(vh - y - 8, Math.max(...sorted.map((id) => geometry.get(id).h)));
					for (const id of sorted) {
						const geom = geometry.get(id);
						geometry.set(id, { ...geom, x: Math.round(x), y, w: geom.w, h: Math.max(280, Math.round(sharedHeight)), snap: false, minimized: false });
						x += geom.w + gap;
					}
					persist();
					publish();
				},
				isPopoutDefault() {
					return popoutDefault;
				},
				togglePopoutDefault() {
					popoutDefault = !popoutDefault;
					persist();
					publish();
				},
				/**
				 * Throw one session out into its own browser window (deep link), then drop
				 * the in-page window. Plain _blank on purpose: a "noopener" feature makes
				 * open() return null per spec, and a null we keep as "popup blocked" —
				 * in that case the in-page window stays open instead of silently vanishing.
				 */
				popSession(sessionId) {
					const url = window.location.href.split("#")[0] + "#mcw-popout=" + encodeURIComponent(sessionId);
					const opened = typeof window.open === "function" ? window.open(url, "_blank") : null;
					if (opened !== null) store.close(sessionId);
					else console.warn("[multi-chat-windows] popout was blocked by the browser; kept the in-page window open");
				},
				open(sessionId) {
					store.ensureRef(sessionId);
					store.geometryFor(sessionId);
					if (order.includes(sessionId)) return;
					order = [...order, sessionId];
					persist();
					publish();
				},
				close(sessionId) {
					const reference = refs.get(sessionId);
					refs.delete(sessionId);
					if (reference !== void 0) {
						try {
							reference.release();
						} catch (error) {
							console.warn("[multi-chat-windows] release failed:", error);
						}
					}
					if (!order.includes(sessionId)) return;
					order = order.filter((id) => id !== sessionId);
					persist();
					publish();
				},
				toggle(sessionId) {
					if (store.isOpen(sessionId)) store.close(sessionId);
					else store.open(sessionId);
				},
				/** Re-open the windows persisted by a previous page load, keeping geometry. */
				restore() {
					for (const sessionId of savedOrder) {
						if (order.includes(sessionId)) continue;
						const byId = sessions.list.getSnapshot().byId;
						if (byId === void 0 || byId[sessionId] === void 0) continue;
						store.open(sessionId);
					}
				},
				dispose() {
					for (const reference of refs.values()) {
						try {
							reference.release();
						} catch {}
					}
					refs.clear();
					order = [];
					publish();
				}
			};
			return store;
		}
		//#endregion
		//#region lib/client/hooks.js
		/** Subscribe to the session catalog for one id's display title. */
		function useSessionTitle(sessions, sessionId) {
			return useSyncExternalStore(sessions.list.subscribe, () => {
				const byId = sessions.list.getSnapshot().byId;
				const record = byId?.[sessionId];
				return record === void 0 ? void 0 : record.title;
			});
		}
		function useWindowOpen(store, sessionId) {
			return useSyncExternalStore(store.subscribe, () => store.isOpen(sessionId));
		}
		//#endregion
		//#region lib/client/conversation.js
		const SlotContext = createContext(null);
		/**
		 * RenderSlot shared from the layer host; lets session-scoped content render any
		 * slot the window body needs.
		 */
		function FixedChatConversationView(props) {
			return jsx(Fragment, { children: props.renderSlot("conversation.session", { view: "chat" }) });
		}
		/**
		 * The shared Conversation content for the Session provided by the enclosing
		 * SessionProvider. Registered into `mcw.conversation` (session scope), so it
		 * receives the session-standard seats: useSession/useConversation/useSessions,
		 * sessionId and renderFactorySlot. This is the same composition ui-subagent
		 * uses for its sidebar chat, which is why the window body is the real
		 * conversation (composer, model selection, view tabs) rather than a replica.
		 */
		function ConversationContent({ sessionId, useSession, useConversation, useSessions, renderFactorySlot, t }) {
			const slotRender = useContext(SlotContext);
			const session = useSession((value) => value);
			const activeTargets = useConversation((value) => value).activeTargets;
			const shellPhase = activeTargets.size > 0 || !session.blank && !session.awaitingFirstTurn || session.running ? "active" : session.promptAttempted ? "engaging" : "blank";
			const summaryBlank = useSessions((state) => state.byId[sessionId]?.blank);
			const settling = shellPhase === "blank" && session.openState === "loading" && summaryBlank !== true;
			const hero = shellPhase === "blank" && (session.openState === "open" || summaryBlank === true);
			const [headSlot, setHeadSlot] = useState(null);
			useEffect(() => {
				if (settling) return;
				setHeadSlot(document.querySelector('[data-mcw-head="' + sessionId + '"]') ?? null);
			}, [sessionId, settling]);
			if (settling) return jsx("div", { className: "mcw-fallback", children: t("win.loading") });
			/** Header actions are a nicety: newer DSH rejects this entry's render of that
			 *  slot ("not declared by this entry's children"), so never let it sink the body. */
			let jobsBand = null;
			if (react_dom !== null && headSlot !== null && typeof slotRender === "function") {
				try {
					jobsBand = react_dom.createPortal(slotRender("conversation.session.header.actions", {}), headSlot, "mcw-jobs-band");
				} catch {
					jobsBand = null;
				}
			}
			const factoryContent = renderFactorySlot("conversation.content", {
				variant: "embedded",
				phase: hero ? "hero" : "active",
				hero
			}, { slots: { views: FixedChatConversationView } });
			return jobsBand === null ? factoryContent : jsx(Fragment, { children: [jobsBand, factoryContent] });
		}
		//#endregion
		//#region lib/client/window.js
		/** One floating window: chrome plus the native embedded Conversation for its Session. */
		function MultiChatWindow({ store, sessions, SessionProvider, renderSlot, sessionId, t, sessionStatus }) {
			/** Re-render on every store mutation (drags, tiling, minimize state, …). */
			useSyncExternalStore(store.subscribe, store.getSnapshot);
			const geom = store.geomOf(sessionId) ?? store.geometryFor(sessionId);
			const title = useSessionTitle(sessions, sessionId) ?? t("win.loading");
			const statusState = useSessionState(sessionStatus, sessions, sessionId);
			const [interacting, setInteracting] = useState(false);
			const dragRef = useRef(null);
			const geometryRef = useRef(geom);
			geometryRef.current = geom;
			const setGeometry = store.setGeometry;
			const reference = store.refOf(sessionId);
			/** Follow the main conversation while snapped. */
			useEffect(() => {
				if (!geom.snap) return;
				const refollow = () => {
					const current = geometryRef.current;
					if (current === void 0 || !current.snap) return;
					setGeometry(sessionId, { ...computeAnchor(current.w), snap: true });
				};
				let observer;
				if (typeof ResizeObserver === "function") {
					observer = new ResizeObserver(() => refollow());
					observer.observe(document.body);
				}
				const onWinResize = () => refollow();
				window.addEventListener("resize", onWinResize);
				return () => {
					observer?.disconnect();
					window.removeEventListener("resize", onWinResize);
				};
			}, [geom.snap, sessionId, setGeometry]);
			/** Auto-close when the session disappears from the catalog. */
			useEffect(() => {
				return sessions.list.subscribe(() => {
					if (sessions.list.getSnapshot().byId?.[sessionId] === void 0) store.close(sessionId);
				});
			}, [sessions, sessionId, store]);
			const onHeaderDown = useCallback((event) => {
				if (event.button !== 0 || event.target.closest("button") !== null) return;
				const start = { px: event.clientX, py: event.clientY, x: geometryRef.current.x, y: geometryRef.current.y };
				const target = event.currentTarget;
				target.setPointerCapture(event.pointerId);
				dragRef.current = { start, id: event.pointerId, moved: false };
				setInteracting(true);
			}, []);
			const onHeaderMove = useCallback((event) => {
				const drag = dragRef.current;
				if (drag === null || drag.id !== event.pointerId) return;
				const dx = event.clientX - drag.start.px;
				const dy = event.clientY - drag.start.py;
				if (!drag.moved && Math.hypot(dx, dy) < 3) return;
				drag.moved = true;
				const next = clampGeometry({ x: drag.start.x + dx, y: drag.start.y + dy, w: geometryRef.current.w, h: geometryRef.current.h });
				setGeometry(sessionId, { x: next.x, y: next.y, snap: false });
			}, [sessionId, setGeometry]);
			const onHeaderUp = useCallback((event) => {
				const drag = dragRef.current;
				if (drag === null || drag.id !== event.pointerId) return;
				dragRef.current = null;
				event.currentTarget.releasePointerCapture(event.pointerId);
				setInteracting(false);
			}, []);
			const winRef = useRef(null);
			const resizeRef = useRef(null);
			const hoverZoneRef = useRef("");
			/**
			 * Resize hit-testing runs at document capture level instead of invisible
			 * handle strips: in-page content (e.g. the embedded composer) can carry a
			 * higher z-index and cover fixed strips, which blocked bottom resizing.
			 * Zones: 14px corner square at the bottom-left, 7px left / bottom strips.
			 */
			useEffect(() => {
				const el = winRef.current;
				if (el === null) return;
				const zoneFor = (clientX, clientY) => {
					const rect = el.getBoundingClientRect();
					if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return "";
					const dx = clientX - rect.left;
					const dyBottom = rect.bottom - clientY;
					if (dx <= 14 && dyBottom <= 14) return "corner";
					if (dx <= 7 && clientY >= rect.top + 12) return "left";
					if (dyBottom <= 7 && dx > 14) return "bottom";
					return "";
				};
				const applyZone = (zone) => {
					if (zone === hoverZoneRef.current) return;
					hoverZoneRef.current = zone;
					if (zone === "") delete el.dataset.mcwZone;
					else el.dataset.mcwZone = zone;
				};
				const onDocumentMove = (event) => {
					const drag = resizeRef.current;
					if (drag === null) {
						applyZone(zoneFor(event.clientX, event.clientY));
						return;
					}
					if (event.pointerId !== drag.id) return;
					const dx = event.clientX - drag.px;
					const dy = event.clientY - drag.py;
					const patch = {};
					if (drag.zone === "left" || drag.zone === "corner") {
						patch.w = drag.w - dx;
						patch.x = drag.x + dx;
						if (patch.w < 360) {
							patch.x = drag.x + (drag.w - 360);
							patch.w = 360;
						}
					}
					if (drag.zone === "bottom" || drag.zone === "corner") patch.h = drag.h + dy;
					setGeometry(sessionId, clampGeometry({ ...geometryRef.current, ...patch }));
				};
				const onDocumentDown = (event) => {
					if (event.button !== 0) return;
					const zone = zoneFor(event.clientX, event.clientY);
					if (zone === "") return;
					event.preventDefault();
					event.stopPropagation();
					resizeRef.current = { id: event.pointerId, zone, px: event.clientX, py: event.clientY, x: geometryRef.current.x, y: geometryRef.current.y, w: geometryRef.current.w, h: geometryRef.current.h };
					el.setPointerCapture(event.pointerId);
					setInteracting(true);
				};
				const onDocumentUp = (event) => {
					if (resizeRef.current === null || event.pointerId !== resizeRef.current.id) return;
					try {
						el.releasePointerCapture(event.pointerId);
					} catch {}
					resizeRef.current = null;
					setInteracting(false);
				};
				document.addEventListener("pointerdown", onDocumentDown, true);
				document.addEventListener("pointermove", onDocumentMove);
				document.addEventListener("pointerup", onDocumentUp);
				document.addEventListener("pointercancel", onDocumentUp);
				return () => {
					document.removeEventListener("pointerdown", onDocumentDown, true);
					document.removeEventListener("pointermove", onDocumentMove);
					document.removeEventListener("pointerup", onDocumentUp);
					document.removeEventListener("pointercancel", onDocumentUp);
				};
			}, [sessionId, setGeometry, geom.minimized]);
			/** Minimized windows render nothing but stay mounted, so the retained Session stays warm. */
			if (geom.minimized) return null;
			return jsxs("div", {
				ref: winRef,
				className: "mcw-win",
				"data-multi-chat-window": sessionId,
				"data-dragging": interacting || void 0,
				style: { left: geom.x, top: geom.y, width: geom.w, height: geom.h },
				children: [
					jsxs("div", { className: "mcw-head", "data-dragging": interacting || void 0, onPointerDown: onHeaderDown, onPointerMove: onHeaderMove, onPointerUp: onHeaderUp, onPointerCancel: onHeaderUp, children: [
					jsx("span", { className: "mcw-dockDot", "data-running": statusState === "running" || void 0, "data-attention": statusState === "attention" || void 0, "data-done": statusState === "done" || void 0, "data-idle": statusState === "idle" || void 0, title: statusLabelOf(statusState, t) }),
						jsx("span", { className: "mcw-title", children: title }),
					jsx("div", { className: "mcw-headSlot", "data-mcw-head": sessionId }),
						jsx("button", { type: "button", className: "mcw-btn", "data-on": geom.snap || void 0, title: geom.snap ? t("win.snapOn") : t("win.snap"), "aria-label": t("win.snap"), onClick: () => store.snap(sessionId), children: jsxs("svg", { width: 14, height: 14, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": 1.4, children: [jsx("rect", { x: "2", y: "3.5", width: "8.5", height: "9", rx: "1.5" }), jsx("path", { d: "M14.5 3.5v9" }), jsx("path", { d: "M11 8h1.6" }), jsx("path", { d: "M12.6 8l-1.1-1.1M12.6 8l-1.1 1.1" })] }) }),
						jsx("button", { type: "button", className: "mcw-btn", title: t("win.tile"), "aria-label": t("win.tile"), onClick: () => store.tileAllWindows(), children: jsxs("svg", { width: 14, height: 14, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": 1.4, children: [jsx("rect", { x: "2", y: "4.5", width: "5.5", height: "7", rx: "1" }), jsx("rect", { x: "8.5", y: "4.5", width: "5.5", height: "7", rx: "1" })] }) }),
						jsx("button", { type: "button", className: "mcw-btn", title: t("win.minimize"), "aria-label": t("win.minimize"), onClick: () => store.minimize(sessionId), children: jsx("svg", { width: 14, height: 14, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": 1.6, children: jsx("path", { d: "M4.5 6.5l3.5 3.5 3.5-3.5" }) }) }),
						...(canPopout ? [jsx("button", { type: "button", className: "mcw-btn", title: t("win.popout"), "aria-label": t("win.popout"), onClick: () => store.popSession(sessionId), children: jsxs("svg", { width: 14, height: 14, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": 1.4, children: [jsx("path", { d: "M12.5 8v3.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1H8" }), jsx("path", { d: "M9.5 3.5h3v3" }), jsx("path", { d: "M12.5 3.5L8.5 7.5" })] }) })] : []),
						jsx("button", { type: "button", className: "mcw-btn", title: t("window.close"), "aria-label": t("win.closeAria"), onClick: () => store.close(sessionId), children: jsx("svg", { width: 13, height: 13, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": 1.6, children: jsx("path", { d: "M4 4l8 8M12 4l-8 8" }) }) })
					] }),
					jsx("div", { className: "mcw-body", "data-dragging": interacting || void 0, children: reference === void 0 || SessionProvider === void 0 ? jsx("div", { className: "mcw-fallback", children: t("win.loading") }) : jsx(SessionProvider, { session: reference, children: renderSlot("mcw.conversation", {}) }) })
				] }, sessionId);
		}
		/** True status per session, mirroring the sidebar StateDot semantics. */
		function statusStateOf(status) {
			if (status === void 0) return "idle";
			if (status.running === true) return "running";
			const kind = status.pendingInteraction?.kind;
			return kind === "approval" || kind === "plan-review" || kind === "question" ? "attention" : status.completionUnread === true ? "done" : "idle";
		}
		/** Localized label of a status state, used by the window head dot and the dock chips. */
		function statusLabelOf(state, t) {
			return state === "running" ? t("win.running") : state === "attention" ? t("win.attention") : state === "done" ? t("win.done") : t("win.idle");
		}
		/** Live status; uiSession overlay when present, catalog record otherwise. */
		function useSessionState(sessionStatus, sessions, sessionId) {
			return sessionStatus !== void 0
				? useSyncExternalStore(sessionStatus.subscribe, () => statusStateOf(sessionStatus.getSnapshot().get(sessionId)))
				: useSyncExternalStore(sessions.list.subscribe, () => {
					const record = sessions.list.getSnapshot().byId?.[sessionId];
					return statusStateOf({ running: record?.running, pendingInteraction: record?.pendingInteraction, completionUnread: record?.completed });
				});
		}
		/** One minimized-window chip in the bottom dock: click restores, × closes. */
		function MinimizedChip({ store, sessions, sessionId, t, sessionStatus }) {
			useSyncExternalStore(store.subscribe, store.getSnapshot);
			const title = useSessionTitle(sessions, sessionId) ?? t("win.loading");
			const state = useSessionState(sessionStatus, sessions, sessionId);
			const statusLabel = statusLabelOf(state, t);
			return jsxs("div", {
				className: "mcw-dockChip",
				role: "button",
				title: t("win.restore"),
				onClick: () => store.unminimize(sessionId),
				children: [
					jsx("span", { className: "mcw-snapDot mcw-dockDot", "data-running": state === "running" || void 0, "data-attention": state === "attention" || void 0, "data-done": state === "done" || void 0, "data-idle": state === "idle" || void 0, title: statusLabel }),
					jsx("span", { className: "mcw-dockLabel", children: title }),
					jsx("button", { type: "button", className: "mcw-btn", "aria-label": t("win.closeAria"), title: t("win.closeAria"), onClick: (event) => { event.stopPropagation(); store.close(sessionId); }, children: jsx("svg", { width: 12, height: 12, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": 1.6, children: jsx("path", { d: "M4 4l8 8M12 4l-8 8" }) }) })
				]
			}, sessionId);
		}
		/** The shell.overlay entry: floating windows per open session + the minimized dock. */
		function MultiChatLayer({ store, sessions, SessionProvider, renderSlot, t, sessionStatus }) {
			useSyncExternalStore(store.subscribe, store.getSnapshot);
			const order = store.orderSnapshot();
			if (order.length === 0) return null;
			const minimized = order.filter((sessionId) => store.geomOf(sessionId)?.minimized === true);
			return jsx(SlotContext.Provider, { value: renderSlot, children: jsxs("div", { "data-multi-chat-layer": true, children: [
				order.map((sessionId) => jsx(MultiChatWindow, { store, sessions, SessionProvider, renderSlot, sessionId, t, sessionStatus }, sessionId)),
				minimized.length > 0 && jsx("div", { className: "mcw-dock", children: minimized.map((sessionId) => jsx(MinimizedChip, { store, sessions, sessionId, t, sessionStatus }, sessionId)) })
			] }) });
		}
		//#endregion
		//#region lib/client/entries.js
		/** Sidebar row "..." menu item: toggle this session's split window. */
		function OpenWindowMenuItem({ sessionId, useMenuOpenState, store, t }) {
			const menu = typeof useMenuOpenState === "function" ? useMenuOpenState : Array.isArray(useMenuOpenState) ? () => useMenuOpenState : () => [false, () => {}];
			const [, setMenuOpen] = menu();
			const open = useWindowOpen(store, sessionId);
			const label = open ? t("window.close") : t("window.open");
			const onSelect = () => {
				setMenuOpen(false);
				store.toggle(sessionId);
			};
			return jsx("button", { type: "button", className: "mcw-btn", style: { width: "100%", justifyContent: "flex-start", borderRadius: "var(--dsw-radius-sm)", minHeight: 32, padding: "0 12px", fontSize: 13, display: "flex", alignItems: "center", color: "var(--dsw-alias-label-primary)" }, onClick: onSelect, children: label });
		}
		/** Sidebar row "..." menu item: exclusive checkbox toggling the popout-by-default preference. */
		function PopoutDefaultMenuItem({ store, t }) {
			useSyncExternalStore(store.subscribe, store.getSnapshot);
			const on = store.isPopoutDefault();
			return jsx("button", { type: "button", className: "mcw-btn", "aria-pressed": on ? "true" : "false", style: { width: "100%", justifyContent: "flex-start", borderRadius: "var(--dsw-radius-sm)", minHeight: 32, padding: "0 12px", fontSize: 13, display: "flex", alignItems: "center", gap: 8, color: "var(--dsw-alias-label-primary)" }, onClick: () => store.togglePopoutDefault(), children: jsxs("span", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [jsx("span", { style: { width: 14, height: 14, borderRadius: 4, border: "1.5px solid var(--dsw-alias-border-l3)", background: on ? "var(--dsw-alias-state-business-primary)" : "transparent", display: "grid", placeItems: "center", flex: "none" }, children: on ? "✓" : null }), t("win.popoutDefault")] }) });
		}
		/** Sidebar row hover button: window open/close with a split-panels glyph. */
		function OpenWindowRowButton({ sessionId, store, t }) {
			useSyncExternalStore(store.subscribe, store.getSnapshot);
			const open = useWindowOpen(store, sessionId);
			const wantPopout = store.isPopoutDefault() && !open && canPopout;
			const onClick = wantPopout ? () => store.popSession(sessionId) : () => store.toggle(sessionId);
			const label = wantPopout ? t("win.popout") : open ? t("window.close") : t("window.open");
			return jsx("button", {
				type: "button",
				className: "mcw-btn",
				"aria-label": open ? t("window.closeAria") : label,
				title: open ? t("window.close") : label,
				"data-multi-chat-open": open || void 0,
				onClick,
				style: open ? { color: "var(--dsw-alias-state-business-primary)" } : void 0,
				children: jsxs("svg", { width: 14, height: 14, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": 1.4, children: [jsx("rect", { x: "2", y: "3.5", width: "8", height: "9", rx: "1.5" }), jsx("path", { d: "M12 5v6.5" }), jsx("path", { d: "M14 5.8v4.9" })] })
			});
		}
		//#endregion
		//#region lib/client/index.js
		/** Required client services: window registry, sidebar entries, and per-window Session rendering. */
		const inject = ["slots", "sessions", "locale", "uiWorkspace", "uiSession"];
		/**
		 * Client plugin body: registry restore, sidebar entries, the shell.overlay
		 * floating-window layer, and the session-scoped Conversation content.
		 * @param ctx - client root context.
		 */
		function apply(ctx) {
			const sessions = ctx.sessions;
			const store = createWindowStore(sessions);
			const entryProps = { store, sessions, sessionStatus: ctx.uiSession?.sessionStatus };
			const withStore = (Component) => (props) => jsx(Component, { ...props, ...entryProps });
			/** A window popped out via window.open loads the whole app; detected by the deep-link hash. */
			const locationHash = typeof window.location === "object" && window.location !== null ? window.location.hash : "";
			const poppedOut = locationHash.startsWith("#mcw-popout=");
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "multi-chat-windows: dictionaries");
			ctx.effect(() => {
				const disposeMenu = ctx.slots.inject("sidebar.workspaces.session.menu.item", function* () {
					yield ctx.slots.register({
						name: "sidebar.workspaces.session.menu.item",
						id: "dsh-plugin-multi-chat-windows.open",
						order: 150,
						locale: NS
					}, withStore(OpenWindowMenuItem));
					yield ctx.slots.register({
						name: "sidebar.workspaces.session.menu.item",
						id: "dsh-plugin-multi-chat-windows.popout-default",
						order: 151,
						locale: NS
					}, withStore(PopoutDefaultMenuItem));
				});
				const disposeRow = ctx.slots.inject("sidebar.workspaces.session.row.action", function* () {
					yield ctx.slots.register({
						name: "sidebar.workspaces.session.row.action",
						id: "dsh-plugin-multi-chat-windows.open",
						locale: NS
					}, withStore(OpenWindowRowButton));
				});
				const disposeLayer = ctx.slots.inject("shell.overlay", function* () {
					yield ctx.slots.register({
						name: "shell.overlay",
						id: "dsh-plugin-multi-chat-windows.layer",
						order: 60,
						locale: NS,
						children: { "mcw.conversation": { kind: "single", scope: "session" } }
					}, withStore(MultiChatLayer));
				});
				const disposeConversation = ctx.slots.inject("mcw.conversation", function* () {
					yield ctx.slots.register({ name: "mcw.conversation", locale: NS }, ConversationContent);
				});
				return () => {
					disposeConversation();
					disposeLayer();
					disposeRow();
					disposeMenu();
				};
			}, "multi-chat-windows: slot registrations");
			/**
			 * Popout target: focus the deep-linked session in the main view. Retry for a
			 * while in case the workspace boot's own restoreSelection races us.
			 */
			ctx.effect(() => {
				if (typeof window.location !== "object" || window.location === null) return;
				const match = window.location.hash.match(/^#mcw-popout=(.+)$/);
				if (match === null) return;
				window.history.replaceState(null, "", window.location.pathname + window.location.search);
				const sessionId = decodeURIComponent(match[1]);
				let attempts = 0;
				const focus = () => {
					if (ctx.uiWorkspace === void 0) return;
					try {
						ctx.uiWorkspace.openSession(sessionId);
					} catch (error) {
						console.warn("[multi-chat-windows] popout focus failed:", error);
					}
				};
				let stop = false;
				let timer;
				const settle = () => {
					stop = true;
					if (timer !== void 0) window.clearInterval(timer);
					timer = void 0;
					unsubscribe();
				};
				const unsubscribe = sessions.list.subscribe(() => {
					if (stop) return;
					const snapshot = sessions.list.getSnapshot();
					if (snapshot.phase !== "ready" || snapshot.byId?.[sessionId] === void 0) return;
					if (snapshot.byId[sessionId].retainedBy?.mainView) {
						settle();
						return;
					}
					focus();
					if (timer === void 0) timer = window.setInterval(() => {
						attempts++;
						const summary = sessions.list.getSnapshot().byId?.[sessionId];
						if (summary?.retainedBy?.mainView || attempts > 12) {
							if (timer !== void 0) window.clearInterval(timer);
							timer = void 0;
						} else focus();
					}, 400);
				});
				return () => {
					stop = true;
					if (timer !== void 0) window.clearInterval(timer);
					unsubscribe();
				};
			}, "multi-chat-windows: focus popped-out session");
			ctx.effect(() => {
				/** A popped-out instance is a full app: never re-open the persisted floating windows here. */
				if (poppedOut) return;
				let stop = false;
				const unsubscribe = sessions.list.subscribe(() => {
					if (stop) return;
					if (sessions.list.getSnapshot().phase === "ready") {
						stop = true;
						store.restore();
					}
				});
				return () => {
					stop = true;
					unsubscribe();
				};
			}, "multi-chat-windows: restore persisted windows");
			ctx.effect(() => () => {
				store.dispose();
			}, "multi-chat-windows: retained session references");
		}
		//#endregion
		exports.inject = inject;
		exports.apply = apply;
		return module.exports;
	}
});
