<template>
  <div class="mx-auto VueToNuxtLogo <md:-mt-10 tb:mt-1 lg:mt-4">
    <div class="Triangle Triangle--one" />
    <div class="Triangle Triangle--two" />
    <div class="Triangle Triangle--three" />
    <div class="Traiangle Text">Nuxtation</div>
  </div>
</template>
<style lang="scss">
.VueToNuxtLogo {
  position: relative;
  display: inline-block;
  width: 300px;
  height: 180px;

  // overflow: hidden;
  opacity: 0;
  transform: rotateX(180deg);
  animation: turn 2s linear forwards 1s;
}
.Triangle {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}
.Triangle--one {
  // https: //abillyz.com/moco/studies/241
  top: 60px;
  left: 35px;
  height: 80px;
  width: 80px;
  background-color: #7aefc2;
  transform: rotate(30deg) skewY(30deg) scaleX(0.86666);
  border-top-left-radius: 16px;
  &::before,
  &::after {
    content: "";
    position: absolute;
    margin-top: 0;
    margin-left: -40px;
    width: 80px;
    height: 80px;
  }
  &::before {
    background-color: #7aefc2;
    transform: translateX(50%) skewX(-45deg);
    border-top-right-radius: 16px;
  }

  &::after {
    background-color: #7aefc2;
    transform: translateY(50%) skewY(-45deg);
    border-bottom-left-radius: 16px;
  }
}
.Triangle--two {
  top: 75px;
  left: 190px;
  height: 70px;
  width: 70px;
  background-color: var(--bg);
  @at-root.dark {
    background-color: #222;
  }
  transform: rotate(30deg) skewY(30deg) scaleX(0.86666);
  border-top-left-radius: 16px;
  animation: goright 3.5s linear forwards 3.5s;

  &::before,
  &::after {
    content: "";
    position: absolute;
    margin-top: 0;
    margin-left: -35px;
    width: 70px;
    height: 70px;
  }

  &::before {
    background-color: var(--bg);

    @at-root.dark {
      background-color: #222;
    }
    transform: translateX(50%) skewX(-45deg);
    border-top-right-radius: 16px;
  }

  &::after {
    background-color: var(--bg);

    @at-root.dark {
      background-color: #222;
    }
    transform: translateY(50%) skewY(-45deg);
    border-bottom-left-radius: 16px;
  }
}
.Triangle--three {
  top: 88px;
  left: 135px;
  height: 60px;
  width: 60px;
  background-color: #00de88;
  transform: rotate(30deg) skewY(30deg) scaleX(0.86666);
  border-top-left-radius: 8px;
  animation: goright2 2.5s linear forwards 3.5s;
  &::before,
  &::after {
    content: "";
    position: absolute;
    margin-top: 0;
    margin-left: -30px;
    width: 60px;
    height: 60px;
  }
  &::before {
    background-color: #00de88;
    transform: translateX(50%) skewX(-45deg);
    border-top-right-radius: 8px;
  }

  &::after {
    background-color: #00de88;
    transform: translateY(50%) skewY(-45deg);
    // opacity: 0.7;
    border-bottom-left-radius: 8px;
  }
}
.Text {
  @apply font-header font-bold text-shadow-xl grid inset-0 text-dark-500 text-2xl z-15 grid-cols-9 place-items-center dark:text-neutral-50;
  margin-top: 97px;
  margin-left: 86px;
  opacity: 0;
  letter-spacing: 10px;
  animation: fade 5s ease-in forwards 3.5s;
}

@keyframes turn {
  0% {
    transform: rotateX(180deg);
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}

@keyframes cloud {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

@keyframes godown {
  100% {
    top: 180px;
  }
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  70% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
@keyframes goright {
  100% {
    left: 73px;
  }
}
@keyframes goright2 {
  100% {
    left: 90px;
  }
}
@keyframes goleft {
  0% {
    opacity: 0;
    transform: translateX(0);
  }
  // 70% {
  //   opacity: 0.3;
  // }
  100% {
    opacity: 1;
    transform: translateX(-50px);
  }
}
</style>
