from openai import AsyncOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# ─── Module 1: Expense Analyzer ───────────────────────────────────────────────
async def ask_expense_ai(expenses: list, question: str) -> str:
    if not expenses:
        return "📭 No expenses found yet. Add some expenses first, then I can analyze your spending patterns!"

    expense_summary = "\n".join(
        [f"  • {e['category']}: ₹{e['amount']} — {e.get('description', 'N/A')}" for e in expenses]
    )

    prompt = f"""You are a friendly AI financial advisor for Indian college students.

Student's recent expenses:
{expense_summary}

Student asks: "{question}"

Respond with:
1. 📊 **Spending Pattern**: Brief analysis of where money is going
2. ⚠️ **Overspending Alert**: Which category needs attention and why
3. 💡 **3 Practical Tips**: Specific, actionable money-saving tips for Indian students
4. 🎯 **Goal**: One concrete thing to do this week

Use Indian Rupee (₹). Keep it under 200 words. Be warm, encouraging, and specific to Indian college life."""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=450,
        temperature=0.7,
    )
    return response.choices[0].message.content


# ─── Module 2: Affordability Engine ───────────────────────────────────────────
async def ask_affordability_ai(profile: dict, item: str, price: float) -> str:
    available = float(profile.get("monthly_budget", 5000)) - float(profile.get("total_spent", 0))
    monthly_income = float(profile.get("monthly_income", 8000))

    prompt = f"""You are a smart financial advisor for Indian college students.

Student's Financial Snapshot:
  • Monthly Income:      ₹{profile.get('monthly_income', 8000)}
  • Monthly Budget:      ₹{profile.get('monthly_budget', 5000)}
  • Savings Goal:        ₹{profile.get('savings_goal', 2000)}
  • Spent This Month:    ₹{profile.get('total_spent', 0):.0f}
  • Available Balance:   ₹{available:.0f}

Wants to Buy: {item} — ₹{price:,.0f}

Give a crisp structured response:
1. ✅/❌ **Verdict**: Can they afford it right now? (Yes / In X months / Not recommended)
2. 📉 **Budget Impact**: What % of their monthly income is this?
3. 📅 **Savings Plan**: If they can't afford it now, how many months to save ₹{price/4:.0f}/month?
4. 💡 **2 Smart Alternatives**: Cheaper alternatives or ways to get same value for less in India
5. 🎯 **Action**: One clear next step

Keep it under 160 words. Use ₹. Be direct and student-friendly."""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400,
        temperature=0.7,
    )
    return response.choices[0].message.content


# ─── Module 3: Scholarship & Loan Advisor ─────────────────────────────────────
async def ask_scholarship_ai(profile: dict) -> str:
    prompt = f"""You are an expert scholarship and education loan advisor for Indian students.

Student Profile:
  • College/University:    {profile.get('college', 'Indian University')}
  • Course/Stream:         {profile.get('course', 'Engineering')}
  • Annual Family Income:  ₹{profile.get('family_income', 400000):,}
  • Category/Caste:        {profile.get('category', 'General')}
  • State:                 {profile.get('state', 'Maharashtra')}
  • Academic Score/CGPA:   {profile.get('score', '75')}%

Provide detailed guidance:

## 🏆 Top 3 Scholarships You Qualify For
For each: Name, Amount, Eligibility, Deadline, How to Apply

## 🏦 Best Education Loan Options
Compare PSB Loan to Scholar (75 banks), SBI Scholar Loan, and one private option. Include interest rate and repayment.

## 📋 Immediate Action Steps
3 things to do THIS WEEK with specific government portal links (NSP, scholarships.gov.in, Vidyasaarathi)

## 💰 Free Resources
List 3 free platforms/apps for Indian student financial aid.

Be specific, practical, and use real Indian schemes. Max 300 words."""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600,
        temperature=0.7,
    )
    return response.choices[0].message.content
