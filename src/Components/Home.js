import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../Redux/actions";
import Loading from "./Loading";
import SinglePost from "./SinglePost";
import {
  Button,
  Container,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: "75px",
  },
  gridContainer: {
    scrollBehavior: "smooth",
  },
}));

export const Home = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const [loading, setLoading] = React.useState(true);
  const [toggle, setToggle] = React.useState(true);

  useEffect(() => {
    dispatch(getPosts([...user.following, user.username])).then(() => {
      setLoading(false);
    });
    // eslint-disable-next-line
  }, [toggle]);

  return (
    <Container maxWidth="sm" className={classes.root} disableGutters>
      <Grid
        justify="center"
        container
        spacing={3}
        className={classes.gridContainer}
      >
        <Grid item xs={12}>
          <Typography variant="h5">Social Photo App</Typography>
        </Grid>

        {loading ? (
          <Loading />
        ) : posts.length >= 1 ? (
          posts.map((post, index) => <SinglePost post={post} index={index} />)
        ) : (
          <Button onClick={() => setToggle(!toggle)}>Refresh</Button>
        )}
      </Grid>
    </Container>
  );
};

export default Home;
