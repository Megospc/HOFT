# Орда Мух
Орда Мух (Horde Of The Flies или HOTF) — двумерный клеточный автомат на частицах, моделирующий поведение живых существ в стадах.

Венсия реализации: **3.0.2** (12.08.2023)

Автор правила: **Tamás Vicsek** (1995 год)

## Правила
### Константы
**C** — Погрешность\
**A** — Количество\
**W** — Колебание\
**S** — Скорость\
**R** — Зона

### Теория
На двумерном пространстве находится **A** частиц. Каждая частица (**N**) имеет своё направление движения (**Nd**) и позицию на двумерном пространстве (**Nx** и **Ny**). Каждый кадр позиция изменяется по формуле:
```
Nx = Nx+S*cos(Nd);
Ny = Ny+S*sin(Nd);
```
Направление движения меняется каждые **W** кадров на случайное. Также, каждый кадр оно изменяется по формуле:
```
c > 0:
  Nd = a+r;
c = 0:
  Nd = Nd;
```
Где **c** — количество других частиц в радиусе **R**, **a** — их среднее направление, а **r** — случайное число в диопазоне от **-C/2** до **C/2**.