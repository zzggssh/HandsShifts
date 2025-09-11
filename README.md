# HandsShifts

Тестовое задание: React Native (CLI) приложение для просмотра смен по геолокации.

## Функционал
- Первый запуск: запрос точной геолокации
- Загрузка списка смен по координатам
- Список с краткой информацией, детальный экран без повторного запроса
- Фильтры: ближайшие по дате/расстоянию, дневные, ночные, «Мои смены» (избранное)
- Фильтр по датам: лента на 30 дней, мультивыбор
- Светлая/тёмная темы с переключателем
- Pull-to-refresh, повторная попытка и переход в настройки при отказе гео

## Технологии
- React Native CLI + TypeScript
- Навигация: @react-navigation/native + native-stack
- Состояние: MobX + mobx-react-lite
- Геолокация: react-native-geolocation-service + react-native-permissions

## Установка
```bash
npm i
```
Для iOS:
```bash
cd ios && bundle install && bundle exec pod install && cd ..
```

## Запуск
```bash
npx react-native run-android
# или
npx react-native run-ios
```

## Права
- iOS: NSLocationWhenInUseUsageDescription
- Android: ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION

## Архитектура
- src/app — провайдеры (тема, стор), навигация
- src/stores — MobX сторы
- src/services — API и геолокация
- src/screens — экраны списка и деталей
- src/components — UI-компоненты
- src/theme — токены темы
- src/utils — форматирование
- src/types — типы данных

## Коммиты
Conventional Commits с осмысленными темами.

## Примечание
Детальный экран использует данные из уже загруженного списка без повторного запроса.
