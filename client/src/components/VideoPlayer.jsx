import React from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SocketContext } from "../context/SocketContext";

const useStyles = makeStyles((theme) => ({
    video: {
        width: "550px",
        [theme.breakpoints.down("xs")]: {
            width: "300px",
        },
    },
    gridContainer: {
        jutifyContent: "center",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
        },
    },
    paper: {
        padding: "10px",
        border: "2px solid black",
        margin: "10px",
    },
}));

function VideoPlayer() {
    const classes = useStyles();
    return (
        <Grid container className={classes.gridContainer}>
            {/* Our own video  */}
            <Paper className={classes.paper}>
              <Grid item xs={12} md={6}>
                <Typography variant='h5' gutterBottom>Name</Typography>
                <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
              </Grid>
            </Paper>
        </Grid>
    );
}

export default VideoPlayer;
