export enum GameLogs {
    // ---------------------
    // login/logout logs
    // ---------------------
    teamLogin,
    committeeLogin,

    // ---------------------
    // connect/disconnect logs
    // ---------------------
    teamConnect,
    teamDisconnect,
    committeeConnect,
    committeeDisconnect,

    // ---------------------
    // board game
    // ---------------------
    // team
    teamBoardBuild,
    teamRelocate,

    // committee
    committeeBoardAddPoints,
    committeeBoardAddBuff,
    committeeBoardEdit,
}
