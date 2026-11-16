import { game } from "../../../content/game";
import type { TMatchEvent } from "./match.type";

export function announcementFor(event: TMatchEvent): string | null {
  switch (event.kind) {
    case "stolen":
      return game.announce.stolen(event.filesInCore);
    case "leaked":
      return game.announce.leaked(event.leaked, event.total);
    case "recovered":
      return game.announce.recovered(event.filesInCore);
    case "gameOver":
      return game.announce.gameOver;
    case "refused":
      return event.reason === "maxVersion"
        ? game.announce.maxVersion
        : game.placement.reasons[event.reason];
    default:
      return null;
  }
}
