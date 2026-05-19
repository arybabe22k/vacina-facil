package com.vacinafacil.config;

import com.vacinafacil.model.CalendarioVacinal;
import com.vacinafacil.model.UnidadeSanitaria;
import com.vacinafacil.model.Vacina;
import com.vacinafacil.repository.CalendarioVacinalRepository;
import com.vacinafacil.repository.UnidadeSanitariaRepository;
import com.vacinafacil.repository.VacinaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedVacinas(VacinaRepository repository) {
        return args -> {
            if (repository.count() > 0) return;
            repository.save(new Vacina("BCG",                         "Contra a Tuberculose",                                    1, 0));
            repository.save(new Vacina("VAPO",                        "Contra a Pólio Oral",                                     1, 0));
            repository.save(new Vacina("VAP",                         "Contra a Pólio",                                          3, 30));
            repository.save(new Vacina("DTP/HepB/Hib",               "Difteria, Tosse Convulsa, Tétano, Hepatite B e Meningite", 3, 30));
            repository.save(new Vacina("PCV",                         "Contra a Pneumonia",                                      3, 30));
            repository.save(new Vacina("Rotavírus",                   "Contra o Rotavírus",                                      2, 30));
            repository.save(new Vacina("IPV",                         "Contra a Pólio Injectável",                               2, 60));
            repository.save(new Vacina("Vitamina A",                  "Suplementação de Vitamina A",                             1, 0));
            repository.save(new Vacina("Malária",                     "Contra a Malária",                                        4, 30));
            repository.save(new Vacina("Sarampo e Rubéola",           "Contra o Sarampo e Rubéola",                              2, 270));
            repository.save(new Vacina("Vitamina A e Desparasitação", "Suplementação e desparasitação periódica",                1, 0));
            repository.save(new Vacina("HPV",                         "Contra o Cancro do Colo do Útero",                        2, 180));
        };
    }

    @Bean
    CommandLineRunner seedCalendarioVacinal(CalendarioVacinalRepository repository) {
        return args -> {
            if (repository.count() > 0) return;
            repository.save(new CalendarioVacinal("À nascença",                        "BCG",                         "Dose única",     "Contra a Tuberculose",                                    "bebé"));
            repository.save(new CalendarioVacinal("À nascença",                        "VAPO",                        "Dose ao nascer", "Contra a Pólio",                                          "bebé"));
            repository.save(new CalendarioVacinal("Aos 2 meses",                       "VAP",                         "1ª dose",        "Contra a Pólio",                                          "bebé"));
            repository.save(new CalendarioVacinal("Aos 2 meses",                       "DTP/HepB/Hib",               "1ª dose",        "Difteria, Tosse Convulsa, Tétano, Hepatite B e Meningite", "bebé"));
            repository.save(new CalendarioVacinal("Aos 2 meses",                       "PCV",                         "1ª dose",        "Contra a Pneumonia",                                      "bebé"));
            repository.save(new CalendarioVacinal("Aos 2 meses",                       "Rotavírus",                   "1ª dose",        "Contra o Rotavírus",                                      "bebé"));
            repository.save(new CalendarioVacinal("Aos 3 meses",                       "VAP",                         "2ª dose",        "Contra a Pólio",                                          "bebé"));
            repository.save(new CalendarioVacinal("Aos 3 meses",                       "DTP/HepB/Hib",               "2ª dose",        "Difteria, Tosse Convulsa, Tétano, Hepatite B e Meningite", "bebé"));
            repository.save(new CalendarioVacinal("Aos 3 meses",                       "Rotavírus",                   "2ª dose",        "Contra o Rotavírus",                                      "bebé"));
            repository.save(new CalendarioVacinal("Aos 4 meses",                       "VAP",                         "3ª dose",        "Contra a Pólio",                                          "bebé"));
            repository.save(new CalendarioVacinal("Aos 4 meses",                       "IPV",                         "1ª dose",        "Contra a Pólio Injectável",                               "bebé"));
            repository.save(new CalendarioVacinal("Aos 4 meses",                       "DTP/HepB/Hib",               "3ª dose",        "Difteria, Tosse Convulsa, Tétano, Hepatite B e Meningite", "bebé"));
            repository.save(new CalendarioVacinal("Aos 4 meses",                       "PCV",                         "2ª dose",        "Contra a Pneumonia",                                      "bebé"));
            repository.save(new CalendarioVacinal("Aos 6 meses",                       "Vitamina A",                  "Dose",           "Suplementação",                                           "bebé"));
            repository.save(new CalendarioVacinal("Aos 6 meses",                       "Malária",                     "1ª dose",        "Contra a Malária",                                        "bebé"));
            repository.save(new CalendarioVacinal("Aos 7 meses",                       "Malária",                     "2ª dose",        "Contra a Malária",                                        "bebé"));
            repository.save(new CalendarioVacinal("Aos 9 meses",                       "Sarampo e Rubéola",           "1ª dose",        "Contra o Sarampo e Rubéola",                              "criança"));
            repository.save(new CalendarioVacinal("Aos 9 meses",                       "PCV",                         "3ª dose",        "Contra a Pneumonia",                                      "criança"));
            repository.save(new CalendarioVacinal("Aos 9 meses",                       "IPV",                         "2ª dose",        "Contra a Pólio Injectável",                               "criança"));
            repository.save(new CalendarioVacinal("Aos 9 meses",                       "Malária",                     "3ª dose",        "Contra a Malária",                                        "criança"));
            repository.save(new CalendarioVacinal("Aos 12 meses",                      "Vitamina A e Desparasitação", "Dose",           "Suplementação e desparasitação",                          "criança"));
            repository.save(new CalendarioVacinal("Aos 18 meses",                      "Sarampo e Rubéola",           "2ª dose",        "Contra o Sarampo e Rubéola",                              "criança"));
            repository.save(new CalendarioVacinal("Aos 18 meses",                      "Malária",                     "4ª dose",        "Contra a Malária",                                        "criança"));
            repository.save(new CalendarioVacinal("De 6 em 6 meses até aos 59 meses", "Vitamina A e Desparasitação", "Dose periódica", "Reforço periódico",                                       "criança"));
            repository.save(new CalendarioVacinal("Aos 9 anos",                        "HPV",                         "Dose",           "Contra o Cancro do Colo do Útero",                        "adolescente"));
        };
    }

    @Bean
    CommandLineRunner seedUnidadesSanitarias(UnidadeSanitariaRepository repository) {
        return args -> {
            if (repository.count() > 0) return;

            // Maputo Cidade
            repository.save(new UnidadeSanitaria("CS 1º de Maio",           "Maputo", "KaMpfumo",   "Av. Ahmed Sekou Touré",          "21-431234", "07h-20h", -25.9653, 32.5732));
            repository.save(new UnidadeSanitaria("CS Alto Maé",             "Maputo", "KaMpfumo",   "Av. Ho Chi Min",                 "21-431235", "07h-20h", -25.9572, 32.5812));
            repository.save(new UnidadeSanitaria("CS Malhangalene",         "Maputo", "KaMpfumo",   "Av. Mártires da Machava",        "21-431236", "07h-20h", -25.9681, 32.5891));
            repository.save(new UnidadeSanitaria("CS Polana Caniço A",      "Maputo", "KaMaxakeni", "Bairro Polana Caniço",           "21-431237", "07h-20h", -25.9812, 32.6012));
            repository.save(new UnidadeSanitaria("CS Polana Caniço B",      "Maputo", "KaMaxakeni", "Bairro Polana Caniço B",         "21-431238", "07h-20h", -25.9834, 32.6045));
            repository.save(new UnidadeSanitaria("CS Hulene B",             "Maputo", "KaMubukwana","Bairro Hulene",                  "21-431239", "07h-20h", -25.9456, 32.5923));
            repository.save(new UnidadeSanitaria("CS Bagamoyo",             "Maputo", "KaMubukwana","Bairro Bagamoyo",                "21-431240", "07h-20h", -25.9501, 32.5867));
            repository.save(new UnidadeSanitaria("CS Inhagoia B",           "Maputo", "KaTembe",    "Bairro Inhagoia",                "21-431241", "07h-16h", -26.0123, 32.5634));
            repository.save(new UnidadeSanitaria("HG Maputo",               "Maputo", "KaMpfumo",   "Av. Agostinho Neto",             "21-320000", "24h",     -25.9634, 32.5756));

            // Matola
            repository.save(new UnidadeSanitaria("CS Matola Sede",          "Maputo", "Matola",     "Av. das FPLM, Matola",           "21-770001", "07h-20h", -25.9622, 32.4589));
            repository.save(new UnidadeSanitaria("CS Machava Sede",         "Maputo", "Matola",     "Bairro Machava",                 "21-770002", "07h-20h", -25.9734, 32.4712));
            repository.save(new UnidadeSanitaria("CS Tsalala",              "Maputo", "Matola",     "Bairro Tsalala",                 "21-770003", "07h-16h", -25.9845, 32.4823));
            repository.save(new UnidadeSanitaria("HR Matola",               "Maputo", "Matola",     "EN4, Matola",                    "21-770000", "24h",     -25.9601, 32.4601));

            // Gaza
            repository.save(new UnidadeSanitaria("CS Xai-Xai Sede",        "Gaza",   "Xai-Xai",    "Av. Eduardo Mondlane, Xai-Xai",  "22-220001", "07h-20h", -25.0519, 33.6442));
            repository.save(new UnidadeSanitaria("CS Chókwè",               "Gaza",   "Chókwè",     "Bairro Central, Chókwè",         "22-340001", "07h-20h", -24.5312, 32.9823));
            repository.save(new UnidadeSanitaria("HP Gaza",                 "Gaza",   "Xai-Xai",    "Av. Julius Nyerere, Xai-Xai",    "22-220000", "24h",     -25.0534, 33.6389));

            // Inhambane
            repository.save(new UnidadeSanitaria("CS Inhambane Sede",       "Inhambane","Inhambane", "Av. da Independência",           "23-220001", "07h-20h", -23.8651, 35.3834));
            repository.save(new UnidadeSanitaria("CS Maxixe",               "Inhambane","Maxixe",    "Bairro Central, Maxixe",         "23-330001", "07h-20h", -23.8567, 35.3478));
            repository.save(new UnidadeSanitaria("HP Inhambane",            "Inhambane","Inhambane", "Rua do Hospital",                "23-220000", "24h",     -23.8623, 35.3812));

            // Sofala
            repository.save(new UnidadeSanitaria("CS Manga Loforte",        "Sofala",  "Beira",      "Bairro Manga, Beira",            "23-312001", "07h-20h", -19.8345, 34.8512));
            repository.save(new UnidadeSanitaria("CS Nhaconjo",             "Sofala",  "Beira",      "Bairro Nhaconjo, Beira",         "23-312002", "07h-20h", -19.8423, 34.8634));
            repository.save(new UnidadeSanitaria("CS Munhava",              "Sofala",  "Beira",      "Bairro Munhava, Beira",          "23-312003", "07h-20h", -19.8512, 34.8723));
            repository.save(new UnidadeSanitaria("HC Beira",                "Sofala",  "Beira",      "Av. Poder Popular, Beira",       "23-310000", "24h",     -19.8312, 34.8456));

            // Nampula
            repository.save(new UnidadeSanitaria("CS Marrere",              "Nampula", "Nampula",    "Bairro Marrere, Nampula",        "26-212001", "07h-20h", -15.1023, 39.2845));
            repository.save(new UnidadeSanitaria("CS Muhala Expansão",      "Nampula", "Nampula",    "Bairro Muhala, Nampula",         "26-212002", "07h-20h", -15.1134, 39.2956));
            repository.save(new UnidadeSanitaria("HP Nampula",              "Nampula", "Nampula",    "Av. do Trabalho, Nampula",       "26-210000", "24h",     -15.1189, 39.2845));

            // Zambézia
            repository.save(new UnidadeSanitaria("CS Coalane",              "Zambézia","Quelimane",  "Bairro Coalane, Quelimane",      "24-212001", "07h-20h", -17.8723, 36.8812));
            repository.save(new UnidadeSanitaria("CS Chabeco",              "Zambézia","Quelimane",  "Bairro Chabeco, Quelimane",      "24-212002", "07h-20h", -17.8834, 36.8923));
            repository.save(new UnidadeSanitaria("HP Quelimane",            "Zambézia","Quelimane",  "Av. Samora Machel, Quelimane",   "24-210000", "24h",     -17.8778, 36.8889));

            // Tete
            repository.save(new UnidadeSanitaria("CS Matundo",              "Tete",    "Tete",       "Bairro Matundo, Tete",           "25-222001", "07h-20h", -16.1523, 33.5834));
            repository.save(new UnidadeSanitaria("HP Tete",                 "Tete",    "Tete",       "Av. Eduardo Mondlane, Tete",     "25-220000", "24h",     -16.1567, 33.5889));

            // Cabo Delgado
            repository.save(new UnidadeSanitaria("CS Paquitequete",         "Cabo Delgado","Pemba",  "Bairro Paquitequete, Pemba",     "27-220001", "07h-20h", -12.9634, 40.5123));
            repository.save(new UnidadeSanitaria("HP Pemba",                "Cabo Delgado","Pemba",  "Av. 25 de Setembro, Pemba",      "27-220000", "24h",     -12.9712, 40.5189));

            // Niassa
            repository.save(new UnidadeSanitaria("CS Lichinga Sede",        "Niassa",  "Lichinga",   "Bairro Central, Lichinga",       "27-920001", "07h-20h", -13.3123, 35.2423));
            repository.save(new UnidadeSanitaria("HP Lichinga",             "Niassa",  "Lichinga",   "Av. da Independência, Lichinga", "27-920000", "24h",     -13.3189, 35.2489));

            // Manica
            repository.save(new UnidadeSanitaria("CS Chimoio Sede",         "Manica",  "Chimoio",    "Av. 25 de Setembro, Chimoio",    "25-123001", "07h-20h", -19.1123, 33.4723));
            repository.save(new UnidadeSanitaria("HP Chimoio",              "Manica",  "Chimoio",    "Av. do Trabalho, Chimoio",       "25-120000", "24h",     -19.1189, 33.4789));
        };
    }
}