import React, {useState} from "react";
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    InputBase,
    Menu,
    MenuItem,
    Fab,
    Link,
    Typography
} from "@material-ui/core";
import {
    Menu as MenuIcon,
    MailOutline as MailIcon,
    NotificationsNone as NotificationsIcon,
    Person as AccountIcon,
    Search as SearchIcon,
    Send as SendIcon,
    ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";
import classNames from "classnames";

// styles
import useStyles from "./styles";


// context
/*import {
    useLayoutState,
    useLayoutDispatch,
    toggleSidebar,
} from "../../context/LayoutContext";*/
//import { useUserDispatch, signOut } from "../../context/UserContext";

export default function Header(props) {
    let classes = useStyles();

    // local
    let [isSidBarOpen, setIsSidBarOpen] = useState(true);
    let [profileMenu, setProfileMenu] = useState(null);
    let [isSearchOpen, setSearchOpen] = useState(false);

    return (
        <AppBar  className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <IconButton
                    color="inherit"

                    className={classNames(
                        classes.headerMenuButtonSandwich,
                        classes.headerMenuButtonCollapse,
                    )}>
                    {isSidBarOpen ? (
                        <ArrowBackIcon
                            classes={{
                                root: classNames(
                                    classes.headerIcon,
                                    classes.headerIconCollapse,
                                ),
                            }}
                        />
                    ) : (
                        <MenuIcon
                            classes={{
                                root: classNames(
                                    classes.headerIcon,
                                    classes.headerIconCollapse,
                                ),
                            }}
                        />
                    )}
                </IconButton>
                <Typography variant="h6" weight="medium" className={classes.logotype}>
                    Kafka Admin
                </Typography>
                <div className={classes.grow}/>
                <div
                    className={classNames(classes.search, {
                        [classes.searchFocused]: isSearchOpen,
                    })}
                >
                    <div
                        className={classNames(classes.searchIcon, {
                            [classes.searchIconOpened]: isSearchOpen,
                        })}
                        onClick={() => setSearchOpen(!isSearchOpen)}
                    >
                        <SearchIcon classes={{root: classes.headerIcon}}/>
                    </div>
                    <InputBase
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                    />
                </div>

                <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    className={classes.headerMenuButton}
                    aria-controls="profile-menu"
                    onClick={e => setProfileMenu(e.currentTarget)}
                >
                    <AccountIcon classes={{root: classes.headerIcon}}/>
                </IconButton>
                <Menu
                    id="profile-menu"
                    open={Boolean(profileMenu)}
                    anchorEl={profileMenu}
                    onClose={() => setProfileMenu(null)}
                    className={classes.headerMenu}
                    classes={{paper: classes.profileMenu}}
                    disableAutoFocusItem
                >
                    <div className={classes.profileMenuUser}>
                        <Typography variant="h4" weight="medium">
                            John Smith
                        </Typography>
                        <Typography
                            className={classes.profileMenuLink}
                            component="a"
                            color="primary"
                            href="https://flatlogic.com">
                            Flalogic.com
                        </Typography>
                    </div>
                    <MenuItem
                        className={classNames(
                            classes.profileMenuItem,
                            classes.headerMenuItem,
                        )}
                    >
                        <AccountIcon className={classes.profileMenuIcon}/> Profile
                    </MenuItem>

                    <div className={classes.profileMenuUser}>
                        <Typography
                            className={classes.profileMenuLink}
                            color="primary">
                            Sign Out
                        </Typography>
                    </div>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
