export function digitsOnly(input: string): string {
  return (input || "").replace(/\D+/g, "");
}

export function isValidCPF(input: string): boolean {
  const cpf = digitsOnly(input);
  if (cpf.length !== 11) return false;
  if (/^([0-9])\1{10}$/.test(cpf)) return false; // all same digits
  const calcCheck = (base: string, factorStart: number) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) sum += parseInt(base[i], 10) * (factorStart - i);
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };
  const d1 = calcCheck(cpf.slice(0, 9), 10);
  if (d1 !== parseInt(cpf[9], 10)) return false;
  const d2 = calcCheck(cpf.slice(0, 10), 11);
  if (d2 !== parseInt(cpf[10], 10)) return false;
  return true;
}

export async function lookupCEP(cepInput: string): Promise<{ uf?: string; address?: string } | null> {
  const cep = digitsOnly(cepInput);
  if (cep.length !== 8) return null;
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!res.ok) return null;
  const data: any = await res.json();
  if (data?.erro) return null;
  const uf = data.uf as string | undefined;
  const parts = [data.logradouro, data.bairro, data.localidade].filter(Boolean);
  const address = parts.join(" - ");
  return { uf, address };
}

// Masks
export function maskCPF(input: string): string {
  const d = digitsOnly(input).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCEP(input: string): string {
  const d = digitsOnly(input).slice(0, 8);
  return d.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

export function maskPhone(input: string): string {
  const d = digitsOnly(input).slice(0, 11);
  if (d.length <= 10) {
    return d
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return d
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}


