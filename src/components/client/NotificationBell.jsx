import React from 'react';
import { Bell, X, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const NotificationBell = ({ notifications, onNotificationClick, onMarkAsRead }) => {
    const unreadCount = notifications.filter(n => !n.read).length;

    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 z-50">
                        <Card className="p-4 max-h-96 overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg">Notificaciones</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-muted rounded"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {notifications.length === 0 ? (
                                <p className="text-muted-foreground text-sm text-center py-8">
                                    No tienes notificaciones
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${notification.read
                                                    ? 'bg-card border-border'
                                                    : 'bg-primary/10 border-primary/30'
                                                }`}
                                            onClick={() => {
                                                onNotificationClick(notification);
                                                setIsOpen(false);
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                    <FileText className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm mb-1">
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(notification.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};
