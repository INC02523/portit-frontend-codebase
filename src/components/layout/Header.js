import {
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import Incture from '../../data/images/InctureLogo.png'


// eslint-disable-next-line react/prop-types
const Header = ( ) => {
  return (
    <>
      <AppBar
        position=""
        className="min-h-[50px] max-h-[50px]"
        sx={{
          backgroundColor: "#2A4862",
          color: "white",
          minHeight: "50px",
          maxHeight: "50px",
          boxShadow: "none",
        }}
      >
        <Toolbar
          style={{
            minHeight: "50px",
            maxHeight: "50px",
            "@media (min-width: 600px)": {
              minHeight: "50px",
              maxHeight: "50px",
            },
          }}
          className="text-white min-h-[50px] max-h-[50px] mr-[-15px]  gap-5"
        >
          {/* <IconButton
            aria-label="delete"
            sx={{ color: "white" }}
            onClick={() => setDrawerState(!drawerState)}
          >
            {drawerState ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton> */}
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <h2 className="text-sm md:text-2xl text-left text-white py-2 px-4">
            Integration Workbench
            </h2>
          </Typography> */}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <div className="flex">
              <img
                src={Incture}
                className="object-contain"
                alt="Incture logo"
              />
              {/* <h1>Incture</h1> */}
              <h1 className="text-xl ml-3 font-thin tracking-wider border-l pl-4">Integration Workbench</h1>
            </div>
          </Typography>
          
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
