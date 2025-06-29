<template>
  <div id="app" class="font-sans bg-gray-50 min-h-screen">
    <!-- Navbar -->
    <nav class="bg-indigo-600 text-white p-4 sticky top-0 z-10">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-xl font-semibold">Ferdiansyah Pratama</div>

        <!-- Hamburger Icon (Tampil di layar kecil) -->
        <button @click="toggleMenu" class="sm:hidden focus:outline-none">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
            />
          </svg>
        </button>

        <!-- Menu Desktop (Tampil di layar besar) -->
        <ul class="hidden sm:flex sm:space-x-6">
          <li><a href="#home" class="hover:text-indigo-200">Home</a></li>
          <li><a href="#skills" class="hover:text-indigo-200">Skills</a></li>
          <li><a href="#projects" class="hover:text-indigo-200">Projects</a></li>
          <li><a href="#certificates" class="hover:text-indigo-200">Certificates</a></li>
        </ul>
      </div>

      <!-- Menu Mobile (Tampil saat hamburger diklik di layar kecil) -->
      <ul
        v-if="menuOpen"
        class="sm:hidden flex flex-col space-y-2 mt-4 text-center bg-indigo-700 p-4"
      >
        <li><a href="#home" @click="toggleMenu" class="hover:text-indigo-200">Home</a></li>
        <li><a href="#skills" @click="toggleMenu" class="hover:text-indigo-200">Skills</a></li>
        <li><a href="#projects" @click="toggleMenu" class="hover:text-indigo-200">Projects</a></li>
        <li>
          <a href="#certificates" @click="toggleMenu" class="hover:text-indigo-200">Certificates</a>
        </li>
      </ul>
    </nav>

    <!-- Konten Utama -->
    <div class="container mx-auto px-4 py-8">
      <!-- Home Section -->
      <section id="home" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12">
        <div class="flex justify-center">
          <img
            src="./assets/image/Ryou Yamada (山田 リョウ).jpeg"
            alt="Foto Profil"
            class="w-48 h-48 sm:w-64 sm:h-64 rounded-full shadow-md object-cover"
          />
        </div>
        <div class="text-gray-800 text-center md:text-left">
          <h1 class="text-2xl sm:text-3xl font-bold mb-2">Ferdiansyah Pratama</h1>
          <p class="text-base sm:text-lg mb-2">
            Email:
            <a href="mailto:psocietyyy@gmail.com" class="text-indigo-600 hover:underline"
              >psocietyyy@gmail.com</a
            >
          </p>
          <p class="text-base sm:text-lg mb-4">
            GitHub:
            <a href="https://github.com/PSocietyyy" class="text-indigo-600 hover:underline"
              >PSocietyyy</a
            >
          </p>
          <p class="text-gray-600 text-sm sm:text-base">
            FullStack Developer dengan fokus pada PHP, Laravel, React, dan MySQL. Sedikit pengalaman
            di bidang AI.
          </p>
        </div>
      </section>

      <!-- Skills Section -->
      <section id="skills" class="py-12">
        <h2 class="text-xl sm:text-2xl font-bold text-indigo-600 mb-6 text-center">Skills</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div class="bg-white p-3 sm:p-4 rounded shadow flex flex-col items-center">
            <img
              src="./assets/image/php.png"
              alt="PHP"
              class="w-10 h-10 sm:w-12 sm:h-12 mb-2 object-contain"
            />
            <span class="text-sm sm:text-base">PHP</span>
          </div>
          <div class="bg-white p-3 sm:p-4 rounded shadow flex flex-col items-center">
            <img
              src="./assets/image/laravel.497x512.png"
              alt="Laravel"
              class="w-10 h-10 sm:w-12 sm:h-12 mb-2 object-contain"
            />
            <span class="text-sm sm:text-base">Laravel</span>
          </div>
          <div class="bg-white p-3 sm:p-4 rounded shadow flex flex-col items-center">
            <img
              src="./assets/image/java.png"
              alt="Spring"
              class="w-10 h-10 sm:w-12 sm:h-12 mb-2 object-contain"
            />
            <span class="text-sm sm:text-base">Spring</span>
          </div>
          <div class="bg-white p-3 sm:p-4 rounded shadow flex flex-col items-center">
            <img
              src="./assets/image/sql-server.png"
              alt="MySQL"
              class="w-10 h-10 sm:w-12 sm:h-12 mb-2 object-contain"
            />
            <span class="text-sm sm:text-base">MySQL</span>
          </div>
          <div class="bg-white p-3 sm:p-4 rounded shadow flex flex-col items-center">
            <img
              src="./assets/image/python.png"
              alt="Python"
              class="w-10 h-10 sm:w-12 sm:h-12 mb-2 object-contain"
            />
            <span class="text-sm sm:text-base">AI (Python)</span>
          </div>
          <div class="bg-white p-3 sm:p-4 rounded shadow flex flex-col items-center">
            <img
              src="./assets/image/scikit-learn.png"
              alt="Scikit Learn"
              class="w-10 h-10 sm:w-12 sm:h-12 mb-2 object-contain"
            />
            <span class="text-sm sm:text-base">Scikit Learn</span>
          </div>
          <div class="bg-white p-3 sm:p-4 rounded shadow flex flex-col items-center">
            <img
              src="./assets/image/tensorflow.478x512.png"
              alt="Tensorflow"
              class="w-10 h-10 sm:w-12 sm:h-12 mb-2 object-contain"
            />
            <span class="text-sm sm:text-base">Tensorflow</span>
          </div>
          <div class="bg-white p-3 sm:p-4 rounded shadow flex flex-col items-center">
            <img
              src="./assets/image/linux.png"
              alt="Linux"
              class="w-10 h-10 sm:w-12 sm:h-12 mb-2 object-contain"
            />
            <span class="text-sm sm:text-base">Linux</span>
          </div>
          <div class="bg-white p-3 sm:p-4 rounded shadow flex flex-col items-center">
            <img
              src="./assets/image/tailwind-css.512x307.png"
              alt="Tailwind CSS"
              class="w-10 h-10 sm:w-12 sm:h-12 mb-2 object-contain"
            />
            <span class="text-sm sm:text-base">Tailwind CSS</span>
          </div>
        </div>
      </section>

      <!-- Projects Section -->
      <section id="projects" class="py-12">
        <h2 class="text-xl sm:text-2xl font-bold text-indigo-600 mb-6 text-center">Projects</h2>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari proyek..."
          class="w-full sm:w-1/2 mb-6 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 mx-auto block"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="project in filteredProjects"
            :key="project.title"
            class="bg-white p-4 rounded shadow"
          >
            <h3 class="text-lg sm:text-xl font-semibold">{{ project.title }}</h3>
            <p class="text-gray-600 mb-2 text-sm sm:text-base">{{ project.description }}</p>
            <a :href="project.link" class="text-indigo-600 hover:underline text-sm sm:text-base"
              >Lihat</a
            >
          </div>
        </div>
      </section>

      <!-- Certificates Section -->
      <section id="certificates" class="py-12">
        <h2 class="text-xl sm:text-2xl font-bold text-indigo-600 mb-6 text-center">Certificates</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-4 rounded shadow flex flex-col">
            <h3 class="text-lg sm:text-xl font-semibold">Defensive Security Operations</h3>
            <p class="text-gray-600 mb-2 text-sm sm:text-base">Cybrary - 2024</p>
            <div class="flex space-x-4">
              <a
                href="./assets/sertif/cybrary-cert-defensive-security-operations.pdf"
                download="cybrary-cert-defensive-security-operations.pdf"
                class="text-indigo-600 hover:underline text-sm sm:text-base"
                >Download</a
              >
            </div>
          </div>
          <div class="bg-white p-4 rounded shadow flex flex-col">
            <h3 class="text-lg sm:text-xl font-semibold">Linux Fundamentals</h3>
            <p class="text-gray-600 mb-2 text-sm sm:text-base">Aguna Course - 2024</p>
            <div class="flex space-x-4">
              <a
                href="./assets/sertif/linux_fundamental_sertifikat.pdf"
                download="linux_fundamental_sertifikat.pdf"
                class="text-indigo-600 hover:underline text-sm sm:text-base"
                >Download</a
              >
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Back to Top Button -->
    <button
      v-if="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Data untuk hamburger menu, pencarian proyek, dan back to top
const menuOpen = ref(false)
const searchQuery = ref('')
const showBackToTop = ref(false)
const projects = ref([
  {
    title: 'Task Management Landing Page',
    description: 'Landing Page responsif dan terdapat animasi.',
    link: 'https://ferdiansyah-portofolio-task.netlify.app/',
  },
  {
    title: 'Recommendation Film',
    description: 'Sistem rekomendasi film sederhana.',
    link: 'https://github.com/PSocietyyy/recomendation_film',
  },
  {
    title: 'Port Scanner',
    description: 'Alat untuk memindai port jaringan.',
    link: 'https://github.com/PSocietyyy/Port_scanner',
  },
  {
    title: 'Diabetes Diagnosis',
    description: 'Diagnosis apakah seseorang terkena diabetes atau tidak',
    link: 'https://www.kaggle.com/code/psocietyy/diabetes-diagnosis-using-svm',
  },
  {
    title: 'Prediction Energy Consumption',
    description: 'Memprediksi konsumsi energi berdasarkan tipe bangunan',
    link: 'https://www.kaggle.com/code/psocietyy/prediction-energy-consumption',
  },
])

// Fungsi untuk toggle hamburger menu
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

// Filter proyek berdasarkan pencarian
const filteredProjects = computed(() => {
  return projects.value.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Fungsi untuk back to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', () => {
    showBackToTop.value = window.scrollY > 300
  })
})
</script>

<style>
/* TailwindCSS diimpor di index.html */
</style>
