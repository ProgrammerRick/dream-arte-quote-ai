import "dotenv/config";
import { db, pool } from "@/db";
import { activities, clients, goals, payments, projects } from "@/db/schema";

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function monthsFromNow(months: number, day = 5) {
  const date = new Date();
  date.setMonth(date.getMonth() + months, day);
  return date.toISOString().slice(0, 10);
}

const AVATAR_COLORS = ["#7C3AED", "#A855F7", "#9457FF", "#6D28D9", "#B385FF", "#5423B8"];

async function seed() {
  console.log("🌱 Limpando tabelas...");
  await db.delete(activities);
  await db.delete(payments);
  await db.delete(projects);
  await db.delete(goals);
  await db.delete(clients);

  console.log("🌱 Criando clientes...");
  const clientData = [
    { name: "Marina Costa", company: "Padaria Sabor Real", email: "marina@saborreal.com.br", phone: "(11) 98221-3344", status: "active" as const },
    { name: "Eduardo Ramos", company: "Studio Fit Academia", email: "eduardo@studiofit.com.br", phone: "(21) 99887-1122", status: "active" as const },
    { name: "Camila Duarte", company: "Duarte Advocacia", email: "camila@duarteadv.com.br", phone: "(31) 98765-4433", status: "active" as const },
    { name: "Rafael Nogueira", company: "Nogueira Imóveis", email: "rafael@nogueiraimoveis.com.br", phone: "(41) 99112-8877", status: "active" as const },
    { name: "Beatriz Lima", company: "Lima Estética Avançada", email: "beatriz@limaestetica.com.br", phone: "(51) 98334-2211", status: "active" as const },
    { name: "Thiago Almeida", company: "Almeida Contabilidade", email: "thiago@almeidacontabil.com.br", phone: "(61) 99765-3321", status: "inactive" as const },
    { name: "Juliana Freitas", company: "Freitas Pet Shop", email: "juliana@freitaspet.com.br", phone: "(71) 98123-9988", status: "active" as const },
    { name: "Gustavo Pires", company: "Pires Engenharia", email: "gustavo@piresengenharia.com.br", phone: "(81) 99456-7712", status: "active" as const },
    { name: "Larissa Martins", company: "Martins Moda Autoral", email: "larissa@martinsmoda.com.br", phone: "(11) 97654-1290", status: "inactive" as const },
    { name: "Felipe Rocha", company: "Rocha Turismo & Viagens", email: "felipe@rochaturismo.com.br", phone: "(19) 98877-6655", status: "active" as const },
    { name: "Patrícia Souza", company: "Souza Odontologia", email: "patricia@souzaodonto.com.br", phone: "(27) 99223-4410", status: "active" as const },
    { name: "André Barbosa", company: "Barbosa Marcenaria", email: "andre@barbosamarcenaria.com.br", phone: "(85) 98112-5567", status: "inactive" as const },
  ];

  const insertedClients = await db
    .insert(clients)
    .values(
      clientData.map((c, index) => ({
        ...c,
        avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
      })),
    )
    .returning();

  const byCompany = (name: string) => insertedClients.find((c) => c.company === name)!;

  console.log("🌱 Criando projetos...");
  const projectData = [
    { client: "Padaria Sabor Real", name: "Site institucional + cardápio digital", status: "active" as const, priority: "high" as const, budget: "6800", progress: 65, startDate: monthsFromNow(-2), dueDate: daysFromNow(9) },
    { client: "Studio Fit Academia", name: "Landing page + sistema de matrícula", status: "active" as const, priority: "medium" as const, budget: "5400", progress: 40, startDate: monthsFromNow(-1), dueDate: daysFromNow(21) },
    { client: "Duarte Advocacia", name: "Site institucional jurídico", status: "completed" as const, priority: "medium" as const, budget: "4200", progress: 100, startDate: monthsFromNow(-4), dueDate: monthsFromNow(-2), completedAt: monthsFromNow(-2) },
    { client: "Nogueira Imóveis", name: "Portal de imóveis com busca avançada", status: "active" as const, priority: "high" as const, budget: "12500", progress: 55, startDate: monthsFromNow(-2), dueDate: daysFromNow(4) },
    { client: "Lima Estética Avançada", name: "Site + agendamento online", status: "delayed" as const, priority: "high" as const, budget: "5900", progress: 70, startDate: monthsFromNow(-3), dueDate: daysFromNow(-6) },
    { client: "Freitas Pet Shop", name: "E-commerce completo", status: "active" as const, priority: "high" as const, budget: "15800", progress: 30, startDate: monthsFromNow(-1), dueDate: daysFromNow(35) },
    { client: "Pires Engenharia", name: "Site institucional + portfólio de obras", status: "completed" as const, priority: "medium" as const, budget: "5200", progress: 100, startDate: monthsFromNow(-5), dueDate: monthsFromNow(-3), completedAt: monthsFromNow(-3) },
    { client: "Rocha Turismo & Viagens", name: "Site com catálogo de pacotes", status: "paused" as const, priority: "low" as const, budget: "4700", progress: 20, startDate: monthsFromNow(-1), dueDate: daysFromNow(45) },
    { client: "Souza Odontologia", name: "Landing page + captação de leads", status: "active" as const, priority: "medium" as const, budget: "3600", progress: 80, startDate: monthsFromNow(-1), dueDate: daysFromNow(2) },
    { client: "Martins Moda Autoral", name: "Loja virtual integrada a redes sociais", status: "delayed" as const, priority: "medium" as const, budget: "9800", progress: 45, startDate: monthsFromNow(-3), dueDate: daysFromNow(-14) },
    { client: "Barbosa Marcenaria", name: "Site institucional com galeria", status: "completed" as const, priority: "low" as const, budget: "3100", progress: 100, startDate: monthsFromNow(-6), dueDate: monthsFromNow(-4), completedAt: monthsFromNow(-4) },
    { client: "Duarte Advocacia", name: "Blog jurídico + SEO", status: "active" as const, priority: "low" as const, budget: "2800", progress: 15, startDate: monthsFromNow(0), dueDate: daysFromNow(50) },
  ];

  const insertedProjects = await db
    .insert(projects)
    .values(
      projectData.map((p) => ({
        clientId: byCompany(p.client).id,
        name: p.name,
        status: p.status,
        priority: p.priority,
        budget: p.budget,
        progress: p.progress,
        startDate: p.startDate,
        dueDate: p.dueDate,
        completedAt: p.completedAt ?? null,
        description: `Projeto de criação de site para ${p.client}, conduzido pela Dream Arte.`,
      })),
    )
    .returning();

  console.log("🌱 Criando pagamentos...");
  const paymentRows: (typeof payments.$inferInsert)[] = [];

  for (const project of insertedProjects) {
    const budget = Number(project.budget);
    const entrada = Math.round(budget * 0.4);
    const restante = budget - entrada;

    const entradaPaidAt = project.startDate;
    paymentRows.push({
      projectId: project.id,
      clientId: project.clientId,
      description: `Entrada — ${project.name}`,
      amount: String(entrada),
      status: "paid",
      method: "PIX",
      dueDate: project.startDate ?? daysFromNow(-30),
      paidAt: entradaPaidAt,
    });

    if (project.status === "completed") {
      paymentRows.push({
        projectId: project.id,
        clientId: project.clientId,
        description: `Parcela final — ${project.name}`,
        amount: String(restante),
        status: "paid",
        method: "Transferência",
        dueDate: project.completedAt ?? daysFromNow(-5),
        paidAt: project.completedAt,
      });
    } else if (project.status === "delayed") {
      paymentRows.push({
        projectId: project.id,
        clientId: project.clientId,
        description: `Parcela final — ${project.name}`,
        amount: String(restante),
        status: "overdue",
        dueDate: project.dueDate ?? daysFromNow(-3),
        paidAt: null,
      });
    } else {
      paymentRows.push({
        projectId: project.id,
        clientId: project.clientId,
        description: `Parcela final — ${project.name}`,
        amount: String(restante),
        status: "pending",
        dueDate: project.dueDate ?? daysFromNow(15),
        paidAt: null,
      });
    }
  }

  // Manutenções mensais recorrentes para clientes ativos (histórico de receita).
  const activeClients = insertedClients.filter((c) => c.status === "active").slice(0, 6);
  for (let offset = 5; offset >= 0; offset--) {
    for (const client of activeClients) {
      const paidThisMonth = Math.random() > 0.12;
      paymentRows.push({
        projectId: null,
        clientId: client.id,
        description: "Manutenção mensal do site",
        amount: String(180 + Math.round(Math.random() * 120)),
        status: paidThisMonth ? "paid" : offset === 0 ? "pending" : "overdue",
        method: paidThisMonth ? "PIX" : null,
        dueDate: monthsFromNow(-offset, 10),
        paidAt: paidThisMonth ? monthsFromNow(-offset, 10) : null,
      });
    }
  }

  await db.insert(payments).values(paymentRows);

  console.log("🌱 Criando metas...");
  const now = new Date();
  const period = now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  await db.insert(goals).values([
    {
      title: "Faturamento mensal",
      description: "Meta de receita recebida no mês atual",
      targetAmount: "32000",
      currentAmount: "21400",
      period,
    },
    {
      title: "Novos clientes fechados",
      description: "Meta de novos contratos assinados no mês",
      targetAmount: "6",
      currentAmount: "4",
      period,
    },
    {
      title: "Projetos entregues no prazo",
      description: "Percentual de entregas dentro do prazo combinado",
      targetAmount: "100",
      currentAmount: "78",
      period,
    },
  ]);

  console.log("🌱 Criando atividades recentes...");
  await db.insert(activities).values([
    { type: "payment_received", title: "Pagamento recebido", description: "Padaria Sabor Real quitou a entrada do projeto." },
    { type: "project_status_changed", title: "Projeto atrasado", description: "Lima Estética Avançada passou para status atrasado." },
    { type: "project_created", title: "Novo projeto criado", description: "Blog jurídico + SEO para Duarte Advocacia." },
    { type: "client_created", title: "Novo cliente cadastrado", description: "Felipe Rocha (Rocha Turismo & Viagens) entrou na base." },
    { type: "payment_overdue", title: "Pagamento em atraso", description: "Martins Moda Autoral está com parcela final vencida." },
    { type: "goal_updated", title: "Meta atualizada", description: "Faturamento mensal atingiu 67% da meta." },
  ]);

  console.log("✅ Seed concluído com sucesso.");
}

seed()
  .catch((error) => {
    console.error("❌ Erro ao popular banco de dados", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
