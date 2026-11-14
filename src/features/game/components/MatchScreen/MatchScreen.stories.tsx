import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, within } from "storybook/test";

import { game } from "@/content/game";

import { homePc } from "../../level/homePc.data";
import { Beam } from "../Beam/Beam";
import { Board } from "../Board/Board";
import { BoostEdge } from "../BoostEdge/BoostEdge";
import { BuildItem } from "../BuildItem/BuildItem";
import { Enemy } from "../Enemy/Enemy";
import { FileToken } from "../FileToken/FileToken";
import { MatchHeader } from "../MatchHeader/MatchHeader";
import { RangeRing } from "../RangeRing/RangeRing";
import { Shot } from "../Shot/Shot";
import { TowerCard } from "../TowerCard/TowerCard";
import { Tower } from "../Tower/Tower";
import {
  beams,
  boostEdges,
  buildItems,
  enemies,
  matchHeader,
  selectedTower,
  shots,
  towers,
} from "./MatchScreen.data";
import { matchScreen } from "./MatchScreen.style";

const meta = { title: "Game/MatchScreen" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const HomePcMidWave: Story = {
  render: () => (
    <div className={matchScreen.base}>
      <MatchHeader
        {...matchHeader}
        onPausedChange={fn()}
        onSpeedChange={fn()}
        onSoundChange={fn()}
        onSettingsOpenChange={fn()}
        onDefaultSpeedChange={fn()}
        onStartNow={fn()}
        onRestart={fn()}
        onQuit={fn()}
      />
      <div className={matchScreen.body}>
        <div className={matchScreen.board}>
          <Board map={homePc} files={8} filesInCore={5}>
            <RangeRing type="antivirus" c={7} r={6} range={3} />
            <FileToken state="dropped" x={380} y={252} />
            {boostEdges.map((edge) => (
              <BoostEdge
                key={`${edge.from.c},${edge.from.r}-${edge.to.c},${edge.to.r}`}
                {...edge}
              />
            ))}
            {towers.map((tower) => (
              <Tower key={`${tower.c},${tower.r}`} {...tower} />
            ))}
            {enemies.map((enemy) => (
              <Enemy key={`${enemy.type}-${enemy.x}-${enemy.y}`} {...enemy} />
            ))}
            {shots.map((shot) => (
              <Shot key={`${shot.from.x}-${shot.from.y}`} {...shot} />
            ))}
            {beams.map((beam) => (
              <Beam key={`${beam.from.x}-${beam.from.y}`} {...beam} />
            ))}
          </Board>
        </div>
        <aside className={matchScreen.side}>
          <section aria-labelledby="match-build-heading">
            <h2 id="match-build-heading" className={matchScreen.heading}>
              {game.screen.build}
            </h2>
            <div className={matchScreen.build}>
              {buildItems.map((item) => (
                <BuildItem key={item.type} {...item} onSelect={fn()} />
              ))}
            </div>
          </section>
          <section aria-labelledby="match-selected-heading">
            <h2 id="match-selected-heading" className={matchScreen.heading}>
              {game.screen.selected}
            </h2>
            <TowerCard {...selectedTower} onUpgrade={fn()} onSell={fn()} />
          </section>
        </aside>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("banner", { name: "Match" })).toBeInTheDocument();
    const board = canvas.getByRole("group", { name: "Home PC board" });
    await expect(board).toBeInTheDocument();
    await expect(
      within(board).getByRole("img", { name: "Antivirus v2.0, boosted, selected" }),
    ).toBeInTheDocument();
    await expect(
      within(board).getByRole("img", { name: "Antivirus v2.0, boosted" }),
    ).toBeInTheDocument();
    await expect(
      within(board).getByRole("img", { name: "Dropped file drifting home" }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("heading", { name: "Build" })).toBeInTheDocument();
    await expect(canvas.getByRole("heading", { name: "Selected" })).toBeInTheDocument();
    await expect(canvas.getByRole("heading", { name: "Antivirus" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /Upgrade to v3\.0/ })).toBeInTheDocument();
  },
};
