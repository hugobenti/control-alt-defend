import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useLiveRegion } from "@/features/shared/components/LiveRegion/useLiveRegion";

import { useGameLoop } from "../../hooks/useGameLoop";
import { useMatchStore } from "../../hooks/useMatchStore";
import { createMatchStore } from "../../hooks/matchStore";
import { homePc } from "../../level/homePc.data";
import { announcementFor } from "../../logic/announcements";
import { balance } from "../../logic/balance.data";
import { fileStates } from "../../logic/files";
import type { ICell } from "../../logic/grid.type";
import { createMatch } from "../../logic/match";
import type { IMatchState } from "../../logic/match.type";
import { buildBoardView, buildBuildItems, buildTowerCard } from "../../logic/matchView";
import type { TEnemyType } from "../Enemy/Enemy.type";
import type { TSpawnCount } from "../SandboxControls/SandboxControls.type";
import type { TGameSpeed } from "../SettingsMenu/SettingsMenu.type";
import type { TTowerType } from "../Tower/Tower.type";
import type { ISandboxScreenView } from "./SandboxScreen.type";
import { useBoardInput } from "./useBoardInput";
import { useMatchKeys } from "./useMatchKeys";

export function useSandboxScreen(initialState?: IMatchState): ISandboxScreenView {
  const router = useRouter();
  const [store] = useState(() =>
    createMatchStore(
      initialState ??
        createMatch({
          map: homePc,
          seed: Date.now() % 2 ** 31,
          startBits: balance.economy.startBits,
          files: balance.files.count,
        }),
    ),
  );
  const state = useMatchStore(store);
  const [cursor, moveCursor] = useState<ICell>({ c: 6, r: 6 });
  const [placing, setPlacing] = useState<TTowerType | null>(null);
  const [selectedTowerId, setSelectedTowerId] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState<TGameSpeed>("1");
  const [defaultSpeed, setDefaultSpeed] = useState<TGameSpeed>("1");
  const [sound, setSound] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [restartCount, setRestartCount] = useState(0);
  const [spawnPort, setSpawnPort] = useState("J1");
  const [spawnCount, setSpawnCount] = useState<TSpawnCount>("1");
  const instructionsId = useId();
  const liveRegion = useLiveRegion();
  const lastAnnouncedEvents = useRef(state.events);

  useEffect(() => {
    const previous = lastAnnouncedEvents.current;
    if (previous === state.events) return;
    const firstNew =
      previous.length <= state.events.length &&
      previous.every((event, index) => event === state.events[index])
        ? previous.length
        : 0;
    lastAnnouncedEvents.current = state.events;
    const messages = state.events
      .slice(firstNew)
      .map(announcementFor)
      .filter((message): message is string => message !== null);
    if (messages.length) liveRegion.announce(messages.join(" "));
  }, [state.events, liveRegion]);

  useGameLoop(store, !paused && state.status === "playing", Number(speed) as 1 | 2);
  const map = state.options.map;
  const activate = (cell: ICell = cursor) => {
    moveCursor(cell);
    if (placing) {
      store.dispatch({ kind: "place", type: placing, cell });
    } else {
      setSelectedTowerId(
        state.towers.find((tower) => tower.c === cell.c && tower.r === cell.r)?.id ?? null,
      );
    }
  };
  const cancel = () => {
    if (placing) setPlacing(null);
    else setSelectedTowerId(null);
  };
  const pickTower = (type: TTowerType) => setPlacing((current) => (current === type ? null : type));
  const selectedOrCursor = () =>
    selectedTowerId ??
    state.towers.find((tower) => tower.c === cursor.c && tower.r === cursor.r)?.id;
  const upgrade = () => {
    const towerId = selectedOrCursor();
    if (towerId !== undefined && towerId !== null) store.dispatch({ kind: "upgrade", towerId });
  };
  const sell = () => {
    const towerId = selectedOrCursor();
    if (towerId !== undefined && towerId !== null) {
      store.dispatch({ kind: "sell", towerId });
      setSelectedTowerId(null);
    }
  };
  const spawn = (type: TEnemyType) =>
    store.dispatch({ kind: "spawn", type, portId: spawnPort, count: Number(spawnCount) });
  const grantBits = () => store.dispatch({ kind: "grantBits" });
  const togglePause = () => setPaused((value) => !value);
  const toggleSpeed = () => setSpeed((value) => (value === "1" ? "2" : "1"));
  const { ref: boardRef, ...boardInput } = useBoardInput({
    map,
    onCell: moveCursor,
    onActivate: activate,
    onCancel: cancel,
  });
  const setBoardRef = useCallback(
    (node: HTMLDivElement | null) => {
      boardRef.current = node;
    },
    [boardRef],
  );
  useMatchKeys(
    {
      map,
      cursor,
      moveCursor,
      pickTower,
      cancel,
      upgrade,
      sell,
      toggleSpeed,
      spawn,
      grantBits,
      activate,
      togglePause,
      settingsOpen,
      closeSettings: () => setSettingsOpen(false),
      over: state.status === "over",
    },
    boardRef,
  );
  const restart = () => {
    store.dispatch({ kind: "restart" });
    setPaused(false);
    setSpeed(defaultSpeed);
    setPlacing(null);
    setSelectedTowerId(null);
    setSettingsOpen(false);
    setRestartCount((count) => count + 1);
  };
  useEffect(() => {
    if (restartCount > 0) boardRef.current?.focus();
  }, [restartCount, boardRef]);
  const boardView = buildBoardView(state, { cursor, placing, selectedTowerId });
  return {
    map,
    bits: state.bits,
    tick: state.tick,
    status: state.status,
    cursor,
    placing,
    files: fileStates(state),
    boardView,
    buildItems: buildBuildItems(state, placing).map((item) => ({
      ...item,
      onSelect: () => pickTower(item.type),
    })),
    towerCard: selectedTowerId === null ? null : buildTowerCard(state, selectedTowerId),
    paused,
    speed,
    defaultSpeed,
    sound,
    settingsOpen,
    spawnPort,
    spawnCount,
    ports: map.ports.map((port) => ({ value: port.id, text: port.id })),
    liveRegion,
    boardRef: setBoardRef,
    boardInput,
    instructionsId,
    moveCursor,
    pickTower,
    activate,
    cancel,
    upgrade,
    sell,
    spawn,
    grantBits,
    togglePause,
    toggleSpeed,
    setPaused,
    setSpeed,
    setDefaultSpeed,
    setSound,
    setSettingsOpen,
    setSpawnPort,
    setSpawnCount,
    restart,
    quit: () => router.push("/"),
  };
}
