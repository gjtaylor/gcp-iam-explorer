import {
  AppBar,
  Container,
  Link,
  makeStyles,
  Toolbar,
} from "@material-ui/core";
import React from "react";
import {
  BrowserRouter as Router,
  Link as RouterLink,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { PermissionTable, ServiceTable } from "./Browse";
import Compare from "./Compare";
import { ReactComponent as GithubLogo } from "./github.svg";
import Splash from "./Splash";
import { ReactComponent as TwitterLogo } from "./twitter.svg";
import { Role } from "./types";

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  navItem: {
    marginLeft: theme.spacing(3),
  },
  twitter: {
    height: 24,
    fill: "currentColor",
  },
  github: {
    height: 24,
    fill: "currentColor",
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const ScrollToTop: React.FC = () => {
  const history = useHistory();

  React.useEffect(() => {
    if (history.action === "PUSH") {
      window.scrollTo(0, 0);
    }
  }, [history.location.pathname, history.action]);

  return null;
};

const App: React.FC = () => {
  const classes = useStyles();

  const [roles, setRoles] = React.useState<Role[]>([]);

  React.useEffect(() => {
    (async () => {
      const response = await fetch("/roles.json");

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        alert("Error");
        return;
      }

      const roles: Role[] = await response.json();

      setRoles(roles);
    })();
  }, []);

  if (roles.length === 0) {
    return <Splash />;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className={classes.grow}>
        <AppBar>
          <Toolbar>
            <Link component={RouterLink} to="/" color="inherit" variant="h6">
              GCP IAM Explorer
            </Link>
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              variant="body1"
              className={classes.navItem}
            >
              Browse
            </Link>
            <Link
              component={RouterLink}
              to="/compare"
              color="inherit"
              variant="body1"
              className={classes.navItem}
            >
              Compare
            </Link>
            <div className={classes.grow} />
            <Link
              href="https://twitter.com/yokomotod"
              target="_blank"
              color="inherit"
              className={classes.navItem}
            >
              <TwitterLogo className={classes.twitter} />
            </Link>
            <Link
              href="https://github.com/yokomotod/gcp-iam-explorer"
              target="_blank"
              color="inherit"
              className={classes.navItem}
            >
              <GithubLogo className={classes.github} />
            </Link>
          </Toolbar>
        </AppBar>
        <main>
          <div className={classes.appBarSpacer} />
          <Container maxWidth={false} className={classes.container}>
            <Switch>
              <Route path="/" exact>
                <ServiceTable roles={roles} />
              </Route>
              <Route path="/services" exact>
                <Redirect to="/" />
              </Route>
              <Route path="/services/:service" exact>
                <PermissionTable roles={roles} />
              </Route>
              <Route path="/compare" exact>
                <Compare roles={roles} />
              </Route>
            </Switch>
          </Container>
        </main>
      </div>
    </Router>
  );
};

export default App;
