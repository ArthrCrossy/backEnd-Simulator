import pool from "../config/database";

export async function initDatabase() {
    await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(150) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY unique_email (email)
    )
  `);

    await pool.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      description TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY unique_category_name (name)
    )
  `);

    await pool.execute(`
    CREATE TABLE IF NOT EXISTS questions (
      id INT NOT NULL AUTO_INCREMENT,
      category_id INT NOT NULL,
      question TEXT NOT NULL,
      option_a VARCHAR(255) NOT NULL,
      option_b VARCHAR(255) NOT NULL,
      option_c VARCHAR(255) NOT NULL,
      option_d VARCHAR(255) NOT NULL,
      correct_option CHAR(1) NOT NULL,
      explanation TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      CONSTRAINT fk_questions_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE CASCADE
    )
  `);

    await pool.execute(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      score INT NOT NULL DEFAULT 0,
      total_questions INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      CONSTRAINT fk_quizzes_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);

    await pool.execute(`
    CREATE TABLE IF NOT EXISTS quiz_answers (
      id INT NOT NULL AUTO_INCREMENT,
      quiz_id INT NOT NULL,
      question_id INT NOT NULL,
      selected_option CHAR(1) NOT NULL,
      is_correct BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      CONSTRAINT fk_quiz_answers_quiz
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_quiz_answers_question
        FOREIGN KEY (question_id) REFERENCES questions(id)
        ON DELETE CASCADE
    )
  `);

    console.log("Banco inicializado com sucesso.");
}