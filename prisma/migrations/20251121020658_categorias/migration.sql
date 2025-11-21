/*
  Warnings:

  - Added the required column `capacidad` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "EventoCategorias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventoId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    CONSTRAINT "EventoCategorias_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventoCategorias_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "lugar" TEXT NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME NOT NULL,
    "responsableId" INTEGER NOT NULL,
    CONSTRAINT "Evento_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Persona" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Evento" ("descripcion", "fechaFin", "fechaInicio", "id", "lugar", "nombre", "responsableId", "tipo") SELECT "descripcion", "fechaFin", "fechaInicio", "id", "lugar", "nombre", "responsableId", "tipo" FROM "Evento";
DROP TABLE "Evento";
ALTER TABLE "new_Evento" RENAME TO "Evento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
