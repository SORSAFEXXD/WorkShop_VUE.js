<template>
  <main class="grade-page">
    <v-container class="grade-container">
      <header class="grade-heading">
        <span class="grade-eyebrow">WORKSHOP 02 · SCORE TOOL</span>
        <h1>เครื่องคำนวณ<span>เกรด</span></h1>
        <p>กรอกคะแนนของคุณ แล้วดูผลลัพธ์ได้ทันที</p>
      </header>

      <section class="grade-layout">
        <v-card class="grade-card grade-form-card" flat>
          <div class="grade-card-heading">
            <span class="grade-icon"><v-icon>mdi-calculator-variant-outline</v-icon></span>
            <div>
              <span class="grade-card-eyebrow">YOUR SCORE</span>
              <h2>กรอกคะแนน</h2>
            </div>
          </div>

          <form @submit.prevent="calculateGrade">
            <v-text-field
              v-model="score"
              class="score-input"
              label="คะแนนที่ได้"
              placeholder="ตัวอย่าง 85"
              suffix="/ 100"
              type="text"
              inputmode="decimal"
              autocomplete="off"
              outlined
              hide-details="auto"
              aria-describedby="score-help"
              @input="clearFeedback"
            ></v-text-field>
            <p id="score-help" class="score-help">กรอกตัวเลขตั้งแต่ 0 ถึง 100</p>

            <v-btn class="calculate-button" type="submit" large block>
              <v-icon left>mdi-chart-box-outline</v-icon>
              คำนวณเกรด
            </v-btn>
          </form>

          <v-alert
            v-if="error"
            class="grade-alert"
            type="error"
            outlined
            dense
            role="alert"
          >
            {{ error }}
          </v-alert>

          <div v-if="result" class="grade-result" aria-live="polite">
            <span class="result-label">ผลการคำนวณ</span>
            <div class="result-main">
              <strong class="result-grade" :class="`grade-${result.grade.toLowerCase()}`">
                {{ result.grade }}
              </strong>
              <span class="result-score">{{ result.score }} คะแนน</span>
            </div>
            <p>{{ result.message }}</p>
          </div>
        </v-card>

        <v-card class="grade-card grade-scale-card" flat>
          <div class="grade-card-heading">
            <span class="grade-icon scale-icon"><v-icon>mdi-format-list-numbered</v-icon></span>
            <div>
              <span class="grade-card-eyebrow">GRADE SCALE</span>
              <h2>เกณฑ์การให้คะแนน</h2>
            </div>
          </div>

          <ul class="grade-scale">
            <li v-for="band in gradeBands" :key="band.grade" class="grade-band">
              <span class="band-grade" :class="`grade-${band.grade.toLowerCase()}`">
                {{ band.grade }}
              </span>
              <span class="band-track"><span :style="{ width: band.width }"></span></span>
              <strong>{{ band.range }}</strong>
            </li>
          </ul>

          <div class="scale-note">
            <v-icon small>mdi-information-outline</v-icon>
            <span>คะแนนทศนิยมจะคำนวณตามช่วงคะแนนเดียวกัน</span>
          </div>
        </v-card>
      </section>

      <footer class="grade-footer">
        <span>WORKSHOP 02</span>
        <span>กรอกคะแนนให้ถูกต้อง แล้วกดคำนวณเกรด</span>
      </footer>
    </v-container>
  </main>
</template>

<script>
const gradeBands = [
  { grade: 'A', minimum: 80, range: '80–100', width: '100%' },
  { grade: 'B', minimum: 70, range: '70–79', width: '80%' },
  { grade: 'C', minimum: 60, range: '60–69', width: '60%' },
  { grade: 'D', minimum: 50, range: '50–59', width: '40%' },
  { grade: 'F', minimum: 0, range: '0–49', width: '20%' },
]

export default {
  name: 'GradeView',
  data: () => ({
    score: '',
    result: null,
    error: '',
    gradeBands,
  }),
  methods: {
    clearFeedback() {
      this.error = ''
      this.result = null
    },
    calculateGrade() {
      const value = this.score.trim() === '' ? NaN : Number(this.score)
      if (!Number.isFinite(value)) {
        this.error = 'กรุณากรอกคะแนนเป็นตัวเลข'
        this.result = null
        return
      }

      if (value < 0 || value > 100) {
        this.error = 'คะแนนต้องอยู่ระหว่าง 0 ถึง 100'
        this.result = null
        return
      }

      const band = this.gradeBands.find(item => value >= item.minimum)
      this.error = ''
      this.result = {
        score: value,
        grade: band.grade,
        message: `คะแนน ${value} อยู่ในช่วง ${band.range} คะแนน`,
      }
    },
  },
}
</script>

<style src="./grade.css"></style>
