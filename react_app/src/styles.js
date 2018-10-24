const drawerWidth = 240;
const styles = theme => ({
  root: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
		flexgrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  leftDrawerPaper: {
    position: 'relative',
    width: drawerWidth,
		height:'100vh',
		overflow:'auto',
  },
  rightDrawerPaper: {
    position: 'relative',
    width: drawerWidth,
		height:'100vh',
		overflow:'auto',
    backgroundColor: theme.palette.background.default,
		border:'none',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  toolbar: theme.mixins.toolbar,
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

export default styles;
