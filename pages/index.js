import {
  AppBar,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { SiGoogleanalytics } from "react-icons/si";
import { useRouter } from "next/router";
import SingleStepForm from "../components/SingleStepForm";
import dynamic from "next/dynamic";

const MultiStepForm = dynamic(() => import("../components/MultiStepForm"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const { single } = router.query;
  return (
    <>
      <AppBar
        elevation={0}
        variant="outlined"
        color="inherit"
        position="sticky"
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <SiGoogleanalytics />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ my: 10 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Matte undersøkelse!
          </Typography>
          <Typography sx={{ mb: 4 }}>
            Du har lov til å hoppe over spørsmål :)
          </Typography>
          {single ? <SingleStepForm /> : <MultiStepForm />}
        </Box>
      </Container>
    </>
  );
}
