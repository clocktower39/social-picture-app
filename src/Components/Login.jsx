import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  CameraAlt,
  LocalFireDepartment,
  People,
  PhotoLibrary,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { loginUser } from "../Redux/actions";

const features = [
  { icon: <PhotoLibrary />, title: "Share moments", description: "Upload photos with filters and tags" },
  { icon: <People />, title: "Follow friends", description: "See what people you follow are posting" },
  { icon: <CameraAlt />, title: "Tag people", description: "Pin friends right on your photos" },
  { icon: <LocalFireDepartment />, title: "Discover trending", description: "Find what's hot across the community" },
];

const BrandPanel = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: { xs: 4, md: 6 },
      color: "white",
      background: (theme) =>
        `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
      minHeight: { xs: 240, md: "100%" },
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 50%)",
        pointerEvents: "none",
      }}
    />
    <Box sx={{ position: "relative", zIndex: 1, maxWidth: 460 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, marginBottom: 3 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}
        >
          <CameraAlt sx={{ fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em" lineHeight={1}>
            Social Photo App
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Share your story
          </Typography>
        </Box>
      </Box>
      <Typography variant="h3" fontWeight={700} sx={{ marginBottom: 1.5, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
        Welcome back.
      </Typography>
      <Typography variant="h6" sx={{ opacity: 0.92, fontWeight: 400, marginBottom: 4, lineHeight: 1.5 }}>
        Sign in to continue sharing moments, tagging friends, and discovering what's trending.
      </Typography>
      <Grid container spacing={2.5}>
        {features.map((f) => (
          <Grid size={6} key={f.title}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  backgroundColor: "rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                  {f.title}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.82, lineHeight: 1.3 }}>
                  {f.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

export const Login = (props) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState(
    localStorage.getItem("username") ? localStorage.getItem("username") : ""
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [disableButtonDuringLogin, setDisableButtonDuringLogin] = useState(false);
  const user = useSelector((state) => state.user);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLoginAttempt(e);
    }
  };
  const handleLoginAttempt = (e) => {
    if (username && password) {
      setError(false);
      setErrorMessage("");
      setDisableButtonDuringLogin(true);
      dispatch(loginUser({ username: username, password: password })).then((res) => {
        if (res && res.type === "ERROR") {
          const data = res.error;
          if (data && typeof data === "object") {
            setErrorMessage(data.username || data.password || "Invalid credentials");
          } else {
            setErrorMessage(typeof data === "string" ? data : "Invalid credentials");
          }
          setError(true);
        }
        setDisableButtonDuringLogin(false);
      });
      localStorage.setItem("username", username);
    } else {
      setDisableButtonDuringLogin(false);
      setError(true);
      setErrorMessage("Please enter your username and password");
    }
  };

  if (user.username) {
    return <Navigate to={{ pathname: "/" }} />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? theme.palette.background.default : "#f4f1ec",
      }}
    >
      <Container maxWidth="lg" disableGutters sx={{ display: "flex", alignItems: "stretch", padding: { xs: 0, md: 2 } }}>
        <Paper
          elevation={{ xs: 0, md: 12 }}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            overflow: "hidden",
            borderRadius: { xs: 0, md: 4 },
            minHeight: { xs: "100vh", md: 640 },
          }}
        >
          <Box sx={{ flex: { md: 1.1 } }}>
            <BrandPanel />
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: { xs: 4, md: 6 },
              backgroundColor: "background.paper",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 380, margin: "0 auto" }}>
              <Typography variant="h5" fontWeight={700} sx={{ marginBottom: 0.5 }}>
                Log in
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                Welcome back. Enter your details to continue.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setUsername(e.target.value)}
                  error={error}
                  autoComplete="username"
                  autoFocus
                />
                <TextField
                  fullWidth
                  label="Password"
                  value={password}
                  type={showPassword ? "text" : "password"}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  error={error}
                  helperText={error ? errorMessage : ""}
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((p) => !p)}
                          edge="end"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {error && !errorMessage && (
                  <Typography variant="caption" color="error">
                    Please enter your username and password
                  </Typography>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleLoginAttempt}
                  disabled={disableButtonDuringLogin}
                  startIcon={disableButtonDuringLogin ? <CircularProgress size={16} color="inherit" /> : null}
                  sx={{ paddingY: 1.25, marginTop: 0.5 }}
                >
                  {disableButtonDuringLogin ? "Signing in..." : "Log in"}
                </Button>
              </Box>

              <Divider sx={{ marginY: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                component={Link}
                to="/signup"
                fullWidth
                variant="outlined"
                size="large"
                sx={{ paddingY: 1.25 }}
              >
                Create new account
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center", marginTop: 3, lineHeight: 1.5 }}
              >
                By continuing, you agree to our terms of service and privacy policy.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
