import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const FeatureItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  fontSize: '2.5rem',
  color: theme.palette.primary.main,
}));

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Head>
        <title>Music Rehearsal Scheduler - Coordinate Band Rehearsals Effortlessly</title>
        <meta name="description" content="Streamline your band rehearsals with our scheduler. Coordinate times, track attendance, and optimize scheduling based on member availability." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Music Rehearsal Scheduler
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Streamline your band rehearsals with our comprehensive scheduling platform.
            Coordinate rehearsal times, track attendance, and optimize scheduling based on member availability.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="primary" size="large" onClick={() => router.push('/register')}>
              Sign Up
            </Button>
            <Button variant="outlined" color="primary" size="large" onClick={() => router.push('/login')}>
              Log In
            </Button>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureItem elevation={3}>
              <IconWrapper>
                <MusicNoteIcon fontSize="inherit" />
              </IconWrapper>
              <Typography gutterBottom variant="h5" component="h2">
                Band Management
              </Typography>
              <Typography>
                Create and manage multiple bands, invite members, and assign roles.
              </Typography>
            </FeatureItem>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureItem elevation={3}>
              <IconWrapper>
                <EventNoteIcon fontSize="inherit" />
              </IconWrapper>
              <Typography gutterBottom variant="h5" component="h2">
                Calendar Integration
              </Typography>
              <Typography>
                Sync with Google, Apple, and Outlook calendars for seamless scheduling.
              </Typography>
            </FeatureItem>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureItem elevation={3}>
              <IconWrapper>
                <PeopleIcon fontSize="inherit" />
              </IconWrapper>
              <Typography gutterBottom variant="h5" component="h2">
                Attendance Tracking
              </Typography>
              <Typography>
                Track attendance history and manage substitute musicians easily.
              </Typography>
            </FeatureItem>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureItem elevation={3}>
              <IconWrapper>
                <AccessTimeIcon fontSize="inherit" />
              </IconWrapper>
              <Typography gutterBottom variant="h5" component="h2">
                Smart Scheduling
              </Typography>
              <Typography>
                Get optimal time suggestions based on member availability patterns.
              </Typography>
            </FeatureItem>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}