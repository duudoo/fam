
import { Bell, Calendar, Receipt } from "lucide-react";
import { NotificationType } from "@/utils/types";

export const getNotificationIcon = (type: NotificationType): JSX.Element => {
  if (type.includes('expense')) {
    return <Receipt className="w-5 h-5 text-famacle-blue" />;
  } else if (type.includes('event')) {
    return <Calendar className="w-5 h-5 text-famacle-coral" />;
  } else {
    return <Bell className="w-5 h-5 text-famacle-slate" />;
  }
};
