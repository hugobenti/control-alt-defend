export interface ITowerVersionStats {
  cost: number;
  damage: number;
  rate: number;
  range: number;
}

export interface IEnemyStats {
  health: number;
  speed: number;
  radius: number;
  armor: number;
  reward: number;
}

export interface IBalance {
  towers: {
    firewall: Record<1 | 2 | 3, ITowerVersionStats>;
    antivirus: Record<1 | 2 | 3, ITowerVersionStats> & { pierceReach: number };
    debugger: Record<1 | 2 | 3, ITowerVersionStats> & {
      chainReach: number;
      chainFactor: number;
      rampSeconds: number;
      rampMax: number;
    };
  };
  boost: Record<2 | 3, { damage: number; range: number }>;
  enemies: { worm: IEnemyStats; wormSmall: IEnemyStats; rootkit: IEnemyStats };
  files: { driftSpeed: number; radius: number; count: number };
  movement: {
    turnRateDeg: number;
    arrive: number;
    lookaheadCells: number;
    offsetMax: number;
    splitOffset: number;
    shotTicks: number;
    hitTicks: number;
  };
  economy: { sellRefund: number; startBits: number; grantBits: number };
  sandbox: { groupSpacingS: number };
}
