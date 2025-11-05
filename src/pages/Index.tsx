import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type MarkerType = 'tick' | 'hogweed';
type ZoneType = 'tick-treatment' | 'hogweed-treatment';
type ViewType = 'main' | 'upcoming' | 'current' | 'news';

interface Marker {
  id: string;
  type: MarkerType;
  coords: [number, number];
  description: string;
  timestamp: Date;
}

interface Zone {
  id: string;
  type: ZoneType;
  coords: [number, number][];
  scheduledDate?: Date;
  description: string;
}

interface NewsPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

function Index() {
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [markers, setMarkers] = useState<Marker[]>([
    { id: '1', type: 'tick', coords: [55.751244, 37.618423], description: 'Укус клеща в парке', timestamp: new Date('2025-11-03') },
    { id: '2', type: 'hogweed', coords: [55.753544, 37.621423], description: 'Заросли борщевика', timestamp: new Date('2025-11-04') }
  ]);
  const [zones, setZones] = useState<Zone[]>([
    { id: '1', type: 'tick-treatment', coords: [[55.75, 37.61], [55.76, 37.62]], scheduledDate: new Date('2025-11-10'), description: 'Обработка от клещей' }
  ]);
  const [news, setNews] = useState<NewsPost[]>([
    { id: '1', title: 'Начало сезона обработки территорий', content: 'С 10 ноября начинаются плановые обработки парковых зон от клещей и борщевика.', timestamp: new Date('2025-11-01') }
  ]);

  const handleLogin = () => {
    const validCredentials = [
      { username: 'SergSyn', password: 'Synachev(16072007)' },
      { username: 'IvanGesh', password: 'IvanGesh^2025^' }
    ];

    const isValid = validCredentials.some(
      cred => cred.username === loginForm.username && cred.password === loginForm.password
    );

    if (isValid) {
      setIsAdmin(true);
      setShowLoginDialog(false);
      setLoginForm({ username: '', password: '' });
    } else {
      alert('Неверный логин или пароль');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const NavItem = ({ view, icon, label }: { view: ViewType; icon: string; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
        currentView === view
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
      }`}
    >
      <Icon name={icon} size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-foreground flex items-center gap-2">
            <Icon name="MapPin" size={28} className="text-primary" />
            ЭкоКарта
          </h1>
          <p className="text-sm text-sidebar-foreground/60 mt-1">Мониторинг территорий</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem view="main" icon="Map" label="Главная" />
          <NavItem view="upcoming" icon="Calendar" label="Предстоящие обработки" />
          <NavItem view="current" icon="Activity" label="Текущие обработки" />
          <NavItem view="news" icon="Newspaper" label="Новости" />
        </nav>

        <div className="p-4 space-y-2 border-t border-sidebar-border">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => window.open('https://t.me/+6v-uva0uF4piNmFi', '_blank')}
          >
            <Icon name="MessageCircle" size={18} />
            Поддержка
          </Button>

          {isAdmin ? (
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <Icon name="LogOut" size={18} />
              Выйти
            </Button>
          ) : (
            <Button
              variant="default"
              className="w-full justify-start gap-2"
              onClick={() => setShowLoginDialog(true)}
            >
              <Icon name="Shield" size={18} />
              Админ-панель
            </Button>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {currentView === 'main' && (
          <div className="h-full flex flex-col">
            <header className="bg-card border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Карта меток пользователей</h2>
                  <p className="text-muted-foreground mt-1">Укусы клещей и обнаружения борщевика</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--tick-color))]"></div>
                    Клещи: {markers.filter(m => m.type === 'tick').length}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--hogweed-color))]"></div>
                    Борщевик: {markers.filter(m => m.type === 'hogweed').length}
                  </Badge>
                </div>
              </div>
            </header>

            <div className="flex-1 bg-muted/30 p-6">
              <Card className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Icon name="MapPin" size={64} className="mx-auto text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Яндекс.Карта загружается</h3>
                    <p className="text-muted-foreground">API ключ: b067798c-bd92-448e-a364-21dbcfc19539</p>
                    <p className="text-sm text-muted-foreground mt-2">Москва и Московская область</p>
                  </div>
                </div>
              </Card>

              {isAdmin && (
                <div className="mt-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Icon name="Bell" size={20} className="text-primary" />
                      Новые метки от пользователей
                    </h3>
                    <div className="space-y-3">
                      {markers.slice(0, 3).map(marker => (
                        <div key={marker.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className={`w-2 h-2 mt-2 rounded-full ${marker.type === 'tick' ? 'bg-[hsl(var(--tick-color))]' : 'bg-[hsl(var(--hogweed-color))]'}`}></div>
                          <div className="flex-1">
                            <p className="font-medium">{marker.description}</p>
                            <p className="text-sm text-muted-foreground">
                              Координаты: {marker.coords[0].toFixed(4)}, {marker.coords[1].toFixed(4)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{marker.timestamp.toLocaleDateString('ru-RU')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'upcoming' && (
          <div className="h-full flex flex-col">
            <header className="bg-card border-b border-border p-6">
              <h2 className="text-3xl font-bold">Предстоящие обработки</h2>
              <p className="text-muted-foreground mt-1">Запланированные мероприятия на карте</p>
            </header>

            <div className="flex-1 bg-muted/30 p-6">
              <Card className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Icon name="Calendar" size={64} className="mx-auto text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Карта запланированных обработок</h3>
                    <p className="text-muted-foreground">Административная панель управления зонами</p>
                  </div>
                </div>
              </Card>

              {isAdmin && (
                <div className="mt-6 grid gap-4">
                  {zones.filter(z => z.scheduledDate).map(zone => (
                    <Card key={zone.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-4 h-4 rounded-full ${zone.type === 'tick-treatment' ? 'bg-[hsl(var(--tick-color))]' : 'bg-[hsl(var(--hogweed-color))]'}`}></div>
                          <div>
                            <h4 className="font-semibold">{zone.description}</h4>
                            <p className="text-sm text-muted-foreground">Дата: {zone.scheduledDate?.toLocaleDateString('ru-RU')}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Запланировано</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'current' && (
          <div className="h-full flex flex-col">
            <header className="bg-card border-b border-border p-6">
              <h2 className="text-3xl font-bold">Текущие обработки</h2>
              <p className="text-muted-foreground mt-1">Активные зоны обработки на сегодня</p>
            </header>

            <div className="flex-1 bg-muted/30 p-6">
              <Card className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Icon name="Activity" size={64} className="mx-auto text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Карта текущих обработок</h3>
                    <p className="text-muted-foreground">Только для администраторов</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {currentView === 'news' && (
          <div className="h-full flex flex-col">
            <header className="bg-card border-b border-border p-6">
              <h2 className="text-3xl font-bold">Новости и объявления</h2>
              <p className="text-muted-foreground mt-1">Актуальная информация для пользователей</p>
            </header>

            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {news.map(post => (
                  <Card key={post.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <Badge variant="outline">{post.timestamp.toLocaleDateString('ru-RU')}</Badge>
                    </div>
                    <p className="text-muted-foreground">{post.content}</p>
                  </Card>
                ))}

                {isAdmin && (
                  <Card className="p-6 border-dashed border-2">
                    <Button className="w-full" variant="outline">
                      <Icon name="Plus" size={18} className="mr-2" />
                      Создать новый пост
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Shield" size={24} className="text-primary" />
              Вход для администраторов
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Введите логин"
              />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Введите пароль"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Войти
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Index;
