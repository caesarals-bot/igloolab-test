// Este es el "contrato" de datos que te pasaremos desde el backend.

import type { Product, User } from "@/types"

// Importar imágenes de assets
import amoxicillinImg from "@/assets/amoxicillin-capsules-box.webp"
import paracetamolImg from "@/assets/paracetamol-tablets-box.webp"
import coldFluImg from "@/assets/cold-flu-syrup-bottle.webp"
import ibuprofenImg from "@/assets/ibuprofen-tablets-package.webp"
import omeprazoleImg from "@/assets/omeprazole-capsules-box.webp"

// --- DATOS DE MUESTRA ---

// 3. Un usuario de ejemplo
export const mockUser: User = {
  id: "user-mock-001",
  nombre: "Dr. Ana Torres",
  email: "a.torres@igloolab.co",
  role: "admin",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
}

// 4. Una lista de productos de ejemplo
export const mockProducts: Product[] = [
  {
    id: "med-001",
    nombre: "Amoxicilina 500mg",
    descripcion: "Antibiótico de amplio espectro. Caja de 30 cápsulas.",
    precio: 120.5,
    fechaVencimiento: "2025-12-31",
    fechaElaboracion: "2023-01-01",
    imageUrl: amoxicillinImg,
  },
  {
    id: "med-002",
    nombre: "Paracetamol 1g",
    descripcion: "Analgésico y antipirético. Caja de 20 comprimidos.",
    precio: 85.0,
    fechaVencimiento: "2024-10-15",
    fechaElaboracion: "2023-05-15",
    imageUrl: paracetamolImg,
  },
  {
    id: "med-003",
    nombre: "Jarabe Antigripal",
    descripcion: "Alivio de síntomas de la gripe. Botella de 150ml.",
    precio: 210.0,
    fechaVencimiento: "2026-01-20",
    fechaElaboracion: "2023-07-10",
    imageUrl: coldFluImg,
  },
  {
    id: "med-004",
    nombre: "Ibuprofeno 400mg",
    descripcion: "Antiinflamatorio no esteroideo. Caja de 24 comprimidos.",
    precio: 95.5,
    fechaVencimiento: "2025-08-15",
    fechaElaboracion: "2023-03-22",
    imageUrl: ibuprofenImg,
  },
  {
    id: "med-005",
    nombre: "Omeprazol 20mg",
    descripcion: "Inhibidor de bomba de protones. Caja de 14 cápsulas.",
    precio: 145.0,
    fechaVencimiento: "2026-03-30",
    fechaElaboracion: "2023-09-05",
    imageUrl: omeprazoleImg,
  },
]
