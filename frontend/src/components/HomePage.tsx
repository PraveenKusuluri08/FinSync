import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Avatar,
  Container,
  Link,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupIcon from '@mui/icons-material/Group';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChatIcon from '@mui/icons-material/Chat';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SummarizeIcon from '@mui/icons-material/Summarize';
import GroupsIcon from '@mui/icons-material/Groups';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import GoogleIcon from '@mui/icons-material/Google';

const featureList = [
  {
    icon: <LeaderboardIcon fontSize="large" />,
    title: 'Dashboard Overview',
    description:
      'View quick analytics, charts, and recent spending for smarter decisions.',
  },
  {
    icon: <AssessmentIcon fontSize="large" />,
    title: 'Personal & Group Expense Tracking',
    description:
      'Track your own expenses or shared group expenses with filters and history.',
  },
  {
    icon: <GroupsIcon fontSize="large" />,
    title: 'Group Management',
    description:
      'Create and manage groups, invite members, and split bills fairly.',
  },
  {
    icon: <ReceiptIcon fontSize="large" />,
    title: 'Receipt Uploading',
    description:
      'Upload receipts and associate them with specific personal or group expenses.',
  },
  {
    icon: <SummarizeIcon fontSize="large" />,
    title: 'Split Summary',
    description:
      'Clearly view what you owe and what others owe you — with settling options.',
  },
  {
    icon: <CalendarMonthIcon fontSize="large" />,
    title: 'Calendar View',
    description:
      'See expenses mapped out in a calendar for better visual budgeting.',
  },
  {
    icon: <ChatIcon fontSize="large" />,
    title: 'Built-in Chat',
    description:
      'Communicate with group members inside the app for clarity and coordination.',
  },
  {
    icon: <CreditCardIcon fontSize="large" />,
    title: 'Integrations (Coming Soon)',
    description:
      'Connect with your calendar, bank, or Google Pay for smoother syncing.',
  },
];

const scrollTo = (id) => {
  const section = document.getElementById(id);
  if (section) section.scrollIntoView({ behavior: 'smooth' });
};

const HomePage = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#024731',
        color: 'white',
        minHeight: '100vh',
        py: 8,
        px: 2,
        scrollBehavior: 'smooth',
      }}
    >
      <Container maxWidth="lg">
        <Box id="hero">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Simplify Personal Expenses & Group Expenses, at the Speed of Sync
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.8)" mb={4}>
            ✅ Easy group expense tracking, personal budgeting, and clear split summaries.<br />
            ✅ Upload receipts, manage groups, and communicate with built-in chat.<br />
            ✅ Integrate with Calendar, visualize spending with graphs.
          </Typography>
        </Box>

        <Box id="about">
          <Typography variant="h5" fontWeight={600} mb={2}>
            I want to:
          </Typography>
          <Grid container spacing={3} mb={5}>
            {[
              {
                icon: <AccountBalanceWalletIcon />,
                title: 'Organize my own expenses and Visualize expenses',
                desc: 'Manage and track your personal expenses effortlessly & visualize the expenses.',
              },
              {
                icon: <GroupIcon />,
                title: 'Manage expenses for a small groups',
                desc: 'Easily manage shared costs for up to 9 members within group.',
              },
              {
                icon: <BusinessCenterIcon />,
                title: 'Control expenses for large groups',
                desc: 'Track, split, and sync expenses for large groups upto 15 members.',
              },
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper
                  elevation={4}
                  sx={{ p: 3, backgroundColor: '#036c4e', color: 'white' }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Avatar sx={{ bgcolor: 'white' }}>{item.icon}</Avatar>
                    <Typography variant="h6">{item.title}</Typography>
                  </Box>
                  <Typography variant="body2">{item.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
          <TextField
            variant="outlined"
            placeholder="Enter your email or phone"
            sx={{ backgroundColor: 'white', borderRadius: 1, flex: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">📧</InputAdornment>,
            }}
          />
          <Link href="/signup" underline="none">
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(to right, #00c896, #00e6b6)',
                color: 'black',
                fontWeight: 600,
                px: 4,
              }}
            >
              Get Started
            </Button>
          </Link>
        </Box>

        <Box id="features">
          <Typography
            variant="h4"
            fontWeight={700}
            align="center"
            mt={10}
            mb={4}
            sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
          >
            Features
          </Typography>

          <Grid container spacing={3} mb={4}>
            {featureList.map((feat, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, backgroundColor: '#01422e', color: 'white', height: '100%' }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Avatar sx={{ bgcolor: 'white', color: '#01422e' }}>
                      {feat.icon}
                    </Avatar>
                    <Typography variant="h6">{feat.title}</Typography>
                  </Box>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    {feat.description}
                  </Typography>
                  <Link
                    href="#"
                    underline="hover"
                    sx={{ color: '#00e6b6', fontSize: 14, mt: 1, display: 'inline-block' }}
                  >
                    Learn More
                  </Link>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box textAlign="center" mb={6}>
          <Link onClick={() => scrollTo('features')} underline="none">
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#00e6b6',
                color: '#024731',
                fontWeight: 600,
                borderRadius: 10,
                px: 4,
                py: 1,
              }}
            >
              See All Features
            </Button>
          </Link>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        id="contact"
        sx={{
          mt: 10,
          py: 4,
          backgroundColor: '#013b29',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h6" gutterBottom>
            FinSync
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.7)">
            Making group expense management simple, smart, and collaborative.
          </Typography>

          <Box display="flex" justifyContent="center" gap={4} mt={2} mb={1}>
            <Link onClick={() => scrollTo('hero')} underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
              Home
            </Link>
            <Link onClick={() => scrollTo('about')} underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
              About
            </Link>
            <Link onClick={() => scrollTo('features')} underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
              Features
            </Link>
            <Link onClick={() => scrollTo('contact')} underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
              Contact
            </Link>
          </Box>

          <Typography variant="caption" color="rgba(255,255,255,0.5)">
            © {new Date().getFullYear()} FinSync. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
