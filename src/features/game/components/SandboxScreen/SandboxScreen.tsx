"use client";

import { game } from "@/content/game";
import { LiveRegion } from "@/features/shared/components/LiveRegion/LiveRegion";

import { Beam } from "../Beam/Beam";
import { Board } from "../Board/Board";
import { BoardCursor } from "../BoardCursor/BoardCursor";
import { BoostEdge } from "../BoostEdge/BoostEdge";
import { BuildItem } from "../BuildItem/BuildItem";
import { Enemy } from "../Enemy/Enemy";
import { FileToken } from "../FileToken/FileToken";
import { GameOverOverlay } from "../GameOverOverlay/GameOverOverlay";
import { MatchHeader } from "../MatchHeader/MatchHeader";
import { PlacementGhost } from "../PlacementGhost/PlacementGhost";
import { RangeRing } from "../RangeRing/RangeRing";
import { RoutePreview } from "../RoutePreview/RoutePreview";
import { SandboxControls } from "../SandboxControls/SandboxControls";
import { SandboxStatus } from "../SandboxStatus/SandboxStatus";
import { Shot } from "../Shot/Shot";
import { Tower } from "../Tower/Tower";
import { TowerCard } from "../TowerCard/TowerCard";
import { sandboxScreen as styles } from "./SandboxScreen.style";
import type { ISandboxScreenProps } from "./SandboxScreen.type";
import { useSandboxScreen } from "./useSandboxScreen";

export function SandboxScreen({ initialState }: ISandboxScreenProps) {
  const { boardRef, ...view } = useSandboxScreen(initialState);
  return (
    <main className={styles.base}>
      <h1 className={styles.headingHidden}>{game.sandbox.title}</h1>
      <div className={styles.body} inert={view.status === "over"}>
        <MatchHeader
          level={{ number: 1, name: game.screen.levelName }}
          progress={<SandboxStatus enemiesOnBoard={view.boardView.enemies.length} />}
          files={view.files}
          bits={view.bits}
          paused={view.paused}
          speed={view.speed}
          defaultSpeed={view.defaultSpeed}
          sound={view.sound}
          settingsOpen={view.settingsOpen}
          onPausedChange={view.setPaused}
          onSpeedChange={view.setSpeed}
          onSoundChange={view.setSound}
          onSettingsOpenChange={view.setSettingsOpen}
          onDefaultSpeedChange={view.setDefaultSpeed}
          onRestart={view.restart}
          onQuit={view.quit}
        />
        <div className={styles.playArea}>
          <div
            ref={boardRef}
            role="application"
            tabIndex={0}
            aria-label={game.boardInput.label}
            aria-describedby={view.instructionsId}
            className={styles.board}
          >
            <p id={view.instructionsId} className={styles.headingHidden}>
              {game.boardInput.instructions}
            </p>
            <div
              role="presentation"
              className={styles.boardDrawing}
              onPointerMove={view.boardInput.onPointerMove}
              onPointerUp={view.boardInput.onPointerUp}
              onContextMenu={view.boardInput.onContextMenu}
            >
              <Board
                map={view.map}
                files={view.boardView.files}
                filesInCore={view.boardView.filesInCore}
              >
                <RoutePreview routes={view.boardView.routePreview} />
                {view.boardView.rangeRing && <RangeRing {...view.boardView.rangeRing} />}
                {view.boardView.boostEdges.map((edge, index) => (
                  <BoostEdge key={index} {...edge} />
                ))}
                {view.boardView.towers.map((tower, index) => (
                  <Tower key={index} {...tower} />
                ))}
                {view.boardView.droppedFiles.map((file) => (
                  <FileToken key={file.id} state="dropped" x={file.x} y={file.y} />
                ))}
                {view.boardView.enemies.map((enemy) => (
                  <Enemy key={enemy.id} {...enemy} />
                ))}
                {view.boardView.shots.map((shot, index) => (
                  <Shot key={index} {...shot} />
                ))}
                {view.boardView.beams.map((beam, index) => (
                  <Beam key={index} {...beam} />
                ))}
                {view.boardView.ghost && <PlacementGhost {...view.boardView.ghost} />}
                <BoardCursor {...view.cursor} />
              </Board>
            </div>
          </div>
          <aside className={styles.side}>
            <section aria-labelledby={view.buildHeadingId}>
              <h2 id={view.buildHeadingId} className={styles.heading}>
                {game.screen.build}
              </h2>
              <div className={styles.build}>
                {view.buildItems.map((item) => (
                  <BuildItem key={item.type} {...item} />
                ))}
              </div>
            </section>
            <section aria-labelledby={view.selectedHeadingId}>
              <h2 id={view.selectedHeadingId} className={styles.heading}>
                {game.screen.selected}
              </h2>
              {view.towerCard ? (
                <TowerCard {...view.towerCard} onUpgrade={view.upgrade} onSell={view.sell} />
              ) : (
                <p className={styles.empty}>{game.screen.selectNone}</p>
              )}
            </section>
            <SandboxControls
              port={view.spawnPort}
              ports={view.ports}
              count={view.spawnCount}
              onPortChange={view.setSpawnPort}
              onCountChange={view.setSpawnCount}
              onSpawn={view.spawn}
              onGrantBits={view.grantBits}
            />
          </aside>
        </div>
      </div>
      <GameOverOverlay
        open={view.status === "over"}
        files={view.files.length}
        onRestart={view.restart}
      />
      <LiveRegion message={view.liveRegion.message} slot={view.liveRegion.slot} />
    </main>
  );
}
