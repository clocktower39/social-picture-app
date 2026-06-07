import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  CameraAlt,
  CheckCircle,
  LocalFireDepartment,
  People,
  PhotoLibrary,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { signupUser } from "../Redux/actions";

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
        Join the community.
      </Typography>
      <Typography variant="h6" sx={{ opacity: 0.92, fontWeight: 400, marginBottom: 4, lineHeight: 1.5 }}>
        Create an account to start sharing photos, tagging friends, and exploring what's trending.
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

const passwordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "" };
  let score = 0;
  if (pwd.length >= 6) score += 1;
  if (pwd.length >= 10) score += 1;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
  if (/\d/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Very strong"];
  const colors = ["", "error.main", "warning.main", "info.main", "success.main", "success.main"];
  return { score, label: labels[score], color: colors[score] };
};

const PasswordStrength = ({ password }) => {
  const { score, label, color } = passwordStrength(password);
  if (!password) return null;
  return (
    <Box sx={{ marginTop: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
      <LinearProgress
        variant="determinate"
        value={(score / 5) * 100}
        sx={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          backgroundColor: "action.hover",
          "& .MuiLinearProgress-bar": { backgroundColor: color },
        }}
      />
      <Typography variant="caption" sx={{ color, minWidth: 90, textAlign: "right" }}>
        {label}
      </Typography>
    </Box>
  );
};

export const Signup = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const error = useSelector((state) => state.error);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const isValidEmail = useMemo(() => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  if (user && user._id) {
    return <Navigate to={{ pathname: "/" }} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError("");
    setFieldErrors({});
    setPasswordMismatch(false);

    const localErrors = {};
    if (!firstName.trim()) localErrors.firstName = "First name is required";
    if (!lastName.trim()) localErrors.lastName = "Last name is required";
    if (!username.trim()) localErrors.username = "Username is required";
    if (!email.trim()) localErrors.email = "Email is required";
    else if (!isValidEmail) localErrors.email = "Enter a valid email address";
    if (!password) localErrors.password = "Password is required";
    else if (password.length < 6) localErrors.password = "Use at least 6 characters";
    if (password !== confirmPassword) {
      localErrors.confirmPassword = "Passwords do not match";
      setPasswordMismatch(true);
    }

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }

    setSubmitting(true);
    dispatch(
      signupUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      })
    ).then((res) => {
      setSubmitting(false);
      if (res && res.type === "ERROR") {
        const data = res.error;
        if (data && typeof data === "object") {
          setFieldErrors(data);
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            setServerError(data[firstKey] || "Sign up failed");
          }
        } else if (typeof data === "string") {
          setServerError(data);
        } else if (typeof error === "string") {
          setServerError(error);
        } else {
          setServerError("Sign up failed. Please try again.");
        }
      }
    });
  };

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
            minHeight: { xs: "100vh", md: 720 },
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
              padding: { xs: 4, md: 5 },
              backgroundColor: "background.paper",
              overflowY: "auto",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 440, margin: "0 auto" }} component="form" onSubmit={handleSubmit}>
              <Typography variant="h5" fontWeight={700} sx={{ marginBottom: 0.5 }}>
                Create your account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                Already have one?{" "}
                <Link to="/login" style={{ color: "inherit", fontWeight: 600 }}>
                  Log in instead
                </Link>
              </Typography>

              {serverError && (
                <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => setServerError("")}>
                  {serverError}
                </Alert>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      error={Boolean(fieldErrors.firstName)}
                      helperText={fieldErrors.firstName || " "}
                      autoComplete="given-name"
                      autoFocus
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      error={Boolean(fieldErrors.lastName)}
                      helperText={fieldErrors.lastName || " "}
                      autoComplete="family-name"
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""))}
                  error={Boolean(fieldErrors.username)}
                  helperText={fieldErrors.username || "Letters, numbers, underscores, or dots"}
                  autoComplete="username"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">@</InputAdornment>,
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={Boolean(fieldErrors.email) || (!isValidEmail && Boolean(email))}
                  helperText={
                    fieldErrors.email ||
                    (!isValidEmail && email ? "Enter a valid email address" : " ")
                  }
                  autoComplete="email"
                />
                <Box>
                  <TextField
                    fullWidth
                    label="Password"
                    value={password}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    error={Boolean(fieldErrors.password)}
                    helperText={fieldErrors.password || " "}
                    autoComplete="new-password"
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
                  <PasswordStrength password={password} />
                </Box>
                <TextField
                  fullWidth
                  label="Confirm password"
                  value={confirmPassword}
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordMismatch) setPasswordMismatch(false);
                  }}
                  error={Boolean(fieldErrors.confirmPassword) || passwordMismatch}
                  helperText={fieldErrors.confirmPassword || (passwordMismatch ? "Passwords do not match" : " ")}
                  autoComplete="new-password"
                />

                {password.length >= 6 && password === confirmPassword && password && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "success.main" }}>
                    <CheckCircle fontSize="small" />
                    <Typography variant="caption">Passwords match and meet requirements</Typography>
                  </Box>
                )}

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
                  sx={{ paddingY: 1.25, marginTop: 0.5 }}
                >
                  {submitting ? "Creating account..." : "Create account"}
                </Button>
              </Box>

              <Divider sx={{ marginY: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button component={Link} to="/login" fullWidth variant="outlined" size="large" sx={{ paddingY: 1.25 }}>
                I already have an account
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center", marginTop: 3, lineHeight: 1.5 }}
              >
                By creating an account, you agree to our terms of service and privacy policy.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
