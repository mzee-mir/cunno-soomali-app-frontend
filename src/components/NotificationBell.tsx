import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NotificationService } from "@/lib/NotificationService";
import { RootState } from "@/store/store";
import {
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { formatDistanceToNow } from "date-fns";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading, error } = useSelector(
    (state: RootState) => state.notifications
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Fetch initial notifications and unread count
    NotificationService.fetchNotifications(dispatch);
    NotificationService.fetchUnreadCount(dispatch);
    
    // Set up polling for new notifications (optional)
    const interval = setInterval(() => {
      NotificationService.fetchUnreadCount(dispatch);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    // Mark all as read when opening the popover
    if (unreadCount > 0) {
      NotificationService.markAllAsRead(dispatch);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteNotification = (notificationId: string) => {
    NotificationService.deleteNotification(dispatch, notificationId);
  };

  const handleDeleteAllRead = () => {
    NotificationService.deleteAllRead(dispatch);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <Box>
      <IconButton
        aria-describedby={id}
        color="inherit"
        onClick={handleClick}
        sx={{ position: "relative" }}
      >
        <Badge 
          badgeContent={unreadCount > 0 ? unreadCount : null} 
          color="error"
          max={99}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            width: 350,
            maxHeight: "70vh", // Changed to viewport height percentage
            overflow: "auto", // Ensure scrolling works
          },
        }}
      >
        <Box sx={{ p: 2, position: "sticky", top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
          <Typography variant="h6" component="div">
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Button
              size="small"
              color="primary"
              onClick={handleDeleteAllRead}
              disabled={unreadCount === notifications.length}
              sx={{ float: "right" }}
            >
              Clear Read
            </Button>
          )}
        </Box>

        <Divider />

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 100,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 2 }}>
            {error}
          </Typography>
        ) : notifications.length === 0 ? (
          <Typography sx={{ p: 2, textAlign: "center" }}>
            No notifications
          </Typography>
        ) : (
          <List dense>
            {notifications.map((notification) => (
              <React.Fragment key={`${notification._id}-${notification.createdAt}`}>
                <ListItem
                  sx={{
                    backgroundColor: notification.isRead
                      ? "inherit"
                      : "action.hover",
                  }}
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={formatDistanceToNow(
                      new Date(notification.createdAt),
                      { addSuffix: true }
                    )}
                  />
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleDeleteNotification(notification._id)}
                    aria-label="Delete notification"
                  >
                    <Typography variant="caption">×</Typography>
                  </IconButton>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Popover>
    </Box>
  );
};

export default NotificationBell;